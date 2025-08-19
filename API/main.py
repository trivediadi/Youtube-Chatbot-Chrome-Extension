from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel
app=FastAPI()

origins = [
    "chrome-extension://allbhmeghkdidbpolgcfdjpefdkomljn",  # your extension ID
    "http://127.0.0.1:8000",
    "http://localhost:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class AskRequest(BaseModel):
    videoId: str | None
    query: str

@app.post("/ask")
def ask(req: AskRequest):
    print("Received:", req.dict())
    return {"reply": f"Got query '{req.query}' for video {req.videoId}"}