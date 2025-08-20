# 🎥 YouTube RAG Chatbot (Chrome Extension + FastAPI)

This project is a **prototype Chrome Extension** powered by a **FastAPI backend** and a **RAG (Retrieval-Augmented Generation) chatbot**.  
It allows users to **ask questions about a YouTube video**, and the chatbot will answer **only using the video’s transcript context**.  

---

## 🚀 Features
- Extracts YouTube video transcripts using `youtube-transcript-api`.  
- Splits transcripts into chunks and stores embeddings in a **FAISS vector database**.  
- Uses **LangChain + OpenAI** to build a Retrieval-Augmented Generation pipeline.  
- FastAPI backend to handle requests from the Chrome extension.  
- Chrome Extension UI for users to input their queries directly on YouTube.  

---

## 🛠️ Tech Stack
- **Backend**: FastAPI, LangChain, FAISS, OpenAI API  
- **Frontend**: Chrome Extension (HTML, JS, Manifest V3)  
- **Embedding Model**: `text-embedding-3-small`  
- **LLM**: `gpt-4o-mini`  

---

## 📂 Project Structure
```
Youtube-Chatbot-Chrome-Extension/
│── backend/
│   ├── rag_chatbot.py       # RAG pipeline (transcript + embeddings + LLM)
│   ├── main.py              # FastAPI app (exposes chatbot API)
│
│── extension/
│   ├── manifest.json        # Chrome Extension config
│   ├── popup.html           # Extension popup UI
│   ├── popup.js             # Handles query → FastAPI → response
│   ├── background.js        # Listens for YouTube video ID
│
│── .env                     # Store your OPENAI_API_KEY
│── requirements.txt
│── README.md
```

---

## ⚡ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/youtube-rag-chatbot.git
cd youtube-rag-chatbot
```

### 2️⃣ Install Dependencies
```bash
pip install -r requirements.txt
```

### 3️⃣ Setup Environment
Create a `.env` file in the backend folder:
```
OPENAI_API_KEY=your_openai_api_key
```

### 4️⃣ Run FastAPI Server
```bash
cd backend
uvicorn main:app --reload
```
Server will run on: `http://127.0.0.1:8000`

### 5️⃣ Load Chrome Extension
1. Open **Chrome** → `chrome://extensions/`  
2. Enable **Developer Mode**  
3. Click **Load unpacked** → select the `extension/` folder  

---

## 📌 Usage
1. Open a YouTube video  
2. Click the extension icon  
3. Enter your question (e.g., *"What is this video about?"*)  
4. Extension sends query + video ID → FastAPI → chatbot → response displayed  

---

## 🚧 Improvements (Next Steps)
- Deploy FastAPI backend (e.g., **Render**, **Railway**, **Vercel serverless**)  
- Cache transcripts/embeddings to avoid redundant API calls  
- Improve extension UI/UX  
- Support multiple languages for transcripts  

---

## 📜 License
MIT License © 2025 [Your Name]  
