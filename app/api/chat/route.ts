import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const userQuery = messages[messages.length - 1].content;
if (!userQuery || userQuery.trim() === "") {
  return NextResponse.json({ error: "Query cannot be empty" }, { status: 400 });
}
console.log('user query :' , userQuery);

    // 1. Initialize Gemini Embeddings & Model
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      modelName: "text-embedding-004",
    });
    /*------ to Know which models are suported for your api key run the following commant in terminal
       curl https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY 
    
    --------*/ 

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: process.env.GOOGLE_API_KEY,
      temperature: 0.2,
      maxRetries: 2,
      safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ],
    });
    
    // 2. Setup Pinecone Vector Store
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    const pineconeIndex = pc.index(process.env.PINECONE_INDEX_NAME!);
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
    });
    const retriever = vectorStore.asRetriever(
      {
        k: 5, // number of relevant chunks to retrieve
      }
    );
    // 3. Define the Prompt
    const template = `
     you are a helpful AI assistant for answering questions about the content of a PDF document. Use the following context to provide a detailed and accurate answer.
     If the context does not contain the answer, politely respond that you don't know.
     Answer should be not too much small and not too much long, keep it balanced.
- Write a detailed answer.
At the end of your answer, list the page numbers you used.
Answer the question based only on the following context:

Context:
{context}
{context}
Question: {question}
Answer (with page citations):
    `;
    const prompt = ChatPromptTemplate.fromTemplate(template);
    // 4. THE LOGIC: Manual RAG Chain using Pipes (|)
    // We avoid createRetrievalChain by defining the flow ourselves
    const chain = RunnableSequence.from([
      {
        // Find documents in Pinecone and format them as a single string
        context: retriever.pipe((docs) => docs.map((d) => d.pageContent).join("\n\n")),
        question: new RunnablePassthrough(),
      },
      prompt,
      model,
      new StringOutputParser(),
    ]);

    // 5. Run the chain
    const aiResponse = await chain.invoke(userQuery);
    console.log('ai-response : ' ,aiResponse);
    return NextResponse.json({ 
      role: "assistant", 
      content: aiResponse
    });

  } catch (error: any) {
    console.error("RAG Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}