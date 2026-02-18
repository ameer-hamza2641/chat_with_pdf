import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

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

    // chunking logic goes here
    const spplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 100,
    });
    const chunkedDocs = await spplitter.splitDocuments(docs);
    // 2. THE FIX: Filter out chunks that are empty or just whitespace
    const validDocs = chunkedDocs.filter(
      (doc) => doc.pageContent && doc.pageContent.trim().length > 0,
    );
    if (validDocs.length === 0) {
      console.log(
        `something went wrong while chunking, no content found in the PDF.`,
      );
      return new Response("No content found in the uploaded PDF", {
        status: 400,
      });
    }
    console.log(`valid docs length : ${validDocs.length}`);
    // embedding logic goes here
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      modelName: "gemini-embedding-001",
      taskType: TaskType.RETRIEVAL_DOCUMENT,
    });
    // pinecone upsert logic goes here
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const pineconeIndex = pc.index(process.env.PINECONE_INDEX_NAME!);
    await PineconeStore.fromDocuments(validDocs, embeddings, {
      pineconeIndex,
      maxConcurrency: 4,
    });
    return new Response("File processed successfully", { status: 200 });
  } catch (error) {
    console.error("Error in processing the uploaded file:", error);
    return new Response("Error processing file", { status: 500 });
  }
}
