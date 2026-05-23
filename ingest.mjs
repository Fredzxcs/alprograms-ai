import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import fs from 'fs/promises';
import 'dotenv/config';

// 🚨 SANITY CHECK: Are the keys actually loading?
console.log("--- KEY CHECK ---");
console.log("Pinecone Key Loaded:", process.env.PINECONE_API_KEY ? "YES ✅" : "NO ❌");
console.log("Pinecone Index Name:", process.env.PINECONE_INDEX || "MISSING ❌");
console.log("-----------------\n");

async function ingestData() {
  console.log("1. Reading your local knowledge file...");
  const text = await fs.readFile("knowledge.txt", "utf-8");

  console.log("2. Splitting text into readable chunks...");
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const docs = await textSplitter.createDocuments([text]);
  const rawTexts = docs.map(doc => doc.pageContent);

  console.log("3. Asking OpenAI for embeddings...");
  const embeddings = new OpenAIEmbeddings({ modelName: "text-embedding-3-small" });
  const embeddingsArray = await embeddings.embedDocuments(rawTexts);
  
  console.log("4. Packaging the data...");
  const vectors = [];
  for (let i = 0; i < docs.length; i++) {
    vectors.push({
      id: `chunk-${i}`,
      values: embeddingsArray[i],
      metadata: { text: rawTexts[i] }
    });
  }
  console.log(`✅ Prepared ${vectors.length} records.`);

  console.log("5. Bypassing SDK and uploading directly via HTTP...");
  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  
  // Grab your database's unique server URL dynamically
  const indexInfo = await pinecone.describeIndex(process.env.PINECONE_INDEX);
  
  // 👉 THE PRO TRICK: Raw HTTP Request to Pinecone's Server
  const response = await fetch(`https://${indexInfo.host}/vectors/upsert`, {
    method: "POST",
    headers: {
      "Api-Key": process.env.PINECONE_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ vectors: vectors })
  });

  const result = await response.json();
  
  // Check the server's actual response
  if (result.upsertedCount) {
    console.log(`\n🎉 SUCCESS! Uploaded exactly ${result.upsertedCount} chunks into Pinecone!`);
    console.log("The data pipeline is officially complete.");
  } else {
    console.log("\n❌ SERVER REJECTED IT. Here is the exact reason:");
    console.log(result);
  }
}

ingestData().catch(console.error);