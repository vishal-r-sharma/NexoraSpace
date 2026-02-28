const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");
const { CompanyProject } = require("../models/project.model");
const projectCache = {};


/* -------------------------
   Load Local Embedding Model (Only Once)
------------------------- */
let embedder = null;

async function loadEmbedder() {
  if (!embedder) {
    console.log("🔄 Loading local embedding model...");

    const transformers = await import("@xenova/transformers");

    embedder = await transformers.pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );

    console.log("✅ Local embedding model loaded");
  }

  return embedder;
}

/* -------------------------
   Gemini Chat Model
------------------------- */
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0.2,
  apiKey: process.env.GEMINI_API_KEY,
});

/* -------------------------
   Extract Text
------------------------- */
async function extractText(filePath) {
  if (filePath.endsWith(".pdf")) {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }
  return fs.readFileSync(filePath, "utf-8");
}

/* -------------------------
   Create Local Embedding
------------------------- */
async function createEmbedding(text) {
  const model = await loadEmbedder();
  const output = await model(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}

/* -------------------------
   Cosine Similarity
------------------------- */
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

/* -------------------------
   TRUE FREE RAG
------------------------- */
async function askProjectQuestion({
  companyRef,
  projectId,
  question,
  chatHistory,
}) {

  const cacheKey = `${companyRef}_${projectId}`;

  // If embeddings not cached
  if (!projectCache[cacheKey]) {
    console.log("🔄 Generating embeddings for project...");

    const projectDoc = await CompanyProject.findOne({ companyRef });
    const project = projectDoc.projects.id(projectId);

    if (!project || !project.documents.length) {
      return "No documents found for this project.";
    }

    let fullText = "";
    for (const doc of project.documents) {
      const uploadsRoot = path.join(__dirname, "..", "uploads");

// Remove leading "/uploads/"
const relativePath = doc.fileUrl.replace(/^\/?uploads[\\/]/, "");

const filePath = path.join(uploadsRoot, relativePath);

// Debug log
console.log("📂 Trying to read:", filePath);

if (!fs.existsSync(filePath)) {
  console.warn("⚠️ File not found:", filePath);
  continue; // skip this document instead of crashing
}
      fullText += "\n\n" + (await extractText(filePath));
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 150,
    });

    const docs = await splitter.createDocuments([fullText]);

    const chunkEmbeddings = [];

    for (const doc of docs) {
      const embedding = await createEmbedding(doc.pageContent);
      chunkEmbeddings.push({
        content: doc.pageContent,
        embedding,
      });
    }

    projectCache[cacheKey] = chunkEmbeddings;
    console.log("✅ Project embeddings cached");
  }

  const chunkEmbeddings = projectCache[cacheKey];

  const queryEmbedding = await createEmbedding(question);

  const topChunks = chunkEmbeddings
    .map((c) => ({
      content: c.content,
      score: cosineSimilarity(queryEmbedding, c.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const context = topChunks.map((c) => c.content).join("\n\n");

  const historyText = chatHistory
    .map((m) => `${m.sender.toUpperCase()}: ${m.text}`)
    .join("\n");

const prompt = `
You are Nexora AI Assistant.

If the answer exists in the project context below, use it.

If the question is unrelated to the project documents,
answer using your general knowledge clearly and concisely.

Project Context:
${context}

Chat History:
${historyText}

User Question:
${question}
`;

  const response = await llm.invoke(prompt);
  return response.content;
}

module.exports = { askProjectQuestion };