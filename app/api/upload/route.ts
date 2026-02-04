import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { log } from "console";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob;
    if (!file) {
      return new Response("No file uploaded", { status: 400 });
    }
    // here you load the file into your RAG system
    const loader = new PDFLoader(file);
    const docs = await loader.load();
    
    console.log(`Loaded documents from the PDF  :${docs[0]}`);

    // chunking logic goes here
    const spplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunkedDocs = await spplitter.splitDocuments(docs);
    if(chunkedDocs.length === 0) {
      console.log(`something went wrong while chunking, no content found in the PDF.`);
      return new Response("No content found in the uploaded PDF", { status: 400 });
    }
    // embedding logic goes here
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      modelName: "text-embedding-004",
      taskType: TaskType.RETRIEVAL_DOCUMENT,
    });
    // console.log('embedding : ', embeddings);
    
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const pineconeIndex = pc.index(process.env.PINECONE_INDEX_NAME!);

    const vectorStore = await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
      pineconeIndex,
      maxConcurrency: 4,
    });
    await vectorStore.addDocuments(chunkedDocs);

    return new Response("File processed successfully", { status: 200 });
  } catch (error) {
    console.error("Error processing uploaded file:", error);
    return new Response("Error processing file", { status: 500 });
  }
}
