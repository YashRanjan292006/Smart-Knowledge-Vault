<div align="center">
  <h1>Smart Knowledge Vault</h1>
  <p><strong>Enterprise-Grade RAG Document Intelligence Platform</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Node.js-18.x-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node" />
    <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/MongoDB-Atlas_Vector_Search-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Gemini-1.5_Flash-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" alt="Gemini" />
    <img src="https://img.shields.io/badge/Redis-Upstash-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  </p>
</div>

---

## 📖 Overview

**Smart Knowledge Vault** is a high-performance Retrieval-Augmented Generation (RAG) system designed to securely ingest, embed, and query unstructured documentation. Unlike naive LLM implementations, this architecture utilizes **local semantic embedding pipelines** coupled with cloud-native **Vector Databases** to deliver rapid semantic search capabilities with robust token economics.

## 🏗️ System Architecture

```mermaid
graph TD
    UI[Frontend Client<br/>React + Tailwind] <-->|REST / TanStack Query| API[Express API Gateway]
    
    subgraph Ingestion Pipeline
        API -->|Upload| Multer[File Parser & Chunker]
        Multer --> Embed[Local Embedder<br/>@xenova/transformers]
        Embed -->|384D Vectors| Mongo[(MongoDB Atlas<br/>Vector Store)]
    end
    
    subgraph Inference Pipeline
        API -->|User Query| EmbedQuery[Query Embedder]
        EmbedQuery -->|Cosine Similarity| Mongo
        Mongo -->|Top-K Context| Context[Context Validation]
        Context -->|Strict Prompt| Gemini[Google Gemini<br/>1.5 Flash]
        Gemini --> API
    end
    
    API <--> Cache[(Upstash Redis<br/>Cache & Rate Limits)]
```

## ⚡ Core Engineering Features

1. **Edge/Local Vectorization (Transformers.js):**
   - Implements `all-MiniLM-L6-v2` directly in the Node.js runtime.
   - Eliminates third-party embedding API costs and reduces latency for vectorization.
2. **Hybrid Cloud Vector Store:**
   - Native integration with MongoDB Atlas `$vectorSearch` utilizing HNSW indexing for rapid Cosine Similarity approximations in large vector spaces.
3. **Advanced RAG Prompt Engineering:**
   - Rejects hallucination logic via strictly bounded context windows and fallback grounding constraints prior to Gemini 1.5 Flash inference.
4. **Resilient API Backbone:**
   - Upstash Redis-backed API caching layer delivering <20ms edge responses for duplicate queries.
   - Token-bucket rate limiting via `express-rate-limit` protecting against distributed enumeration.

## 🛠️ Quickstart Guide

### Prerequisites
- Node.js (v18.x+)
- MongoDB Atlas Cluster (Free tier Supported)
- Upstash Serverless Redis Endpoint
- Google AI Studio API Key (Gemini)

### 1. Vector Search Index
Execute the following JSON specification inside MongoDB Atlas on your `chunks` collection to enable ANN search:
```json
{
  "mappings": {
    "dynamic": true,
    "fields": {
      "embedding": {
        "dimensions": 384,
        "similarity": "cosine",
        "type": "knnVector"
      }
    }
  }
}
```

### 2. Microservice Deployment
```bash
# Clone the repository
git clone https://github.com/YashRanjan292006/Smart-Knowledge-Vault.git
cd Smart-Knowledge-Vault

# Spin up Backend Engine
cd backend
npm install
npm run dev

# Spin up Frontend Web Application
cd ../frontend
npm install
npm run dev
```

## 🔒 Environment Variable Schema

```env
# /backend/.env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<auth>@<cluster>.mongodb.net/vault
JWT_SECRET=super_secure_sha256_hash
GEMINI_API_KEY=AIzaSy...
REDIS_URL=redis://...
```

## 📡 Testing & Validation
The backend is rigorously testing using unit blocks.
```bash
cd backend && npm run test
```

---
<div align="center">
  <p>Engineered by Yash Ranjan | Top 1% MERN & AI Integrations</p>
</div>
