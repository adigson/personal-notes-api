# Personal Knowledge Base / Notes API 🧠
**BeTechified Advanced Backend Engineering - Group 1 Project**

A production-ready RESTful API built with Node.js, Express, and MongoDB Atlas. Serves as the backend for a "Second Brain" note-taking application supporting full CRUD operations, payload validation, and advanced filtering (pagination, sorting, text search).

## 🌐 Live API Deployment
- **Base URL:** `https://personal-notes-api.onrender.com/api/notes`
- **GitHub Repository:** `https://github.com/adigson/personal-notes-api`

---

## 🚀 Tech Stack
- **Runtime:** Node.js + Express.js
- **Database:** MongoDB Atlas + Mongoose ODM
- **Validation:** Joi Middleware
- **Deployment:** Render Web Service

---

## 🛠️ API Endpoint Documentation & Examples

### 1. Create a Note
- **POST** `/api/notes`
- **Body (JSON):**
  ```json
  {
    "title": "Backend Architecture Notes",
    "content": "Mastering pagination, sorting, and index-backed text search.",
    "category": "Work",
    "tags": ["nodejs", "mongodb"]
  }
