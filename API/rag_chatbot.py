from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled,NoTranscriptFound
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableParallel,RunnablePassthrough,RunnableLambda
from langchain_core.output_parsers import StrOutputParser
from typing import Dict,Any
from dotenv import load_dotenv
load_dotenv()

TRANSCRIPT_CACHE: Dict[str, str] = {}  
VECTOR_CACHE: Dict[str, Any] = {}   
def get_answer(video_id:str,query:str)->str:
    if not video_id:
        return "No video ID provided."
    if not query or not query.strip():
        return "Please provide a non-empty question."
    transcript = TRANSCRIPT_CACHE.get(video_id)
    if transcript is None:
        try:
            # Try English first, then auto
            try:
                ytt_api=YouTubeTranscriptApi()
                items = ytt_api.fetch(video_id, languages=["en"])
            except NoTranscriptFound:
                items = YouTubeTranscriptApi().fetch(video_id)

            transcript = " ".join(chunk.text for chunk in items if chunk.text)
            if not transcript.strip():
                return "Transcript appears to be empty."
            TRANSCRIPT_CACHE[video_id] = transcript
        except TranscriptsDisabled:
            return "Captions are disabled or unavailable for this video."
        except NoTranscriptFound:
            return "No transcript was found for this video."
        except Exception as e:
            return f"Error fetching transcript: {e}"

    retriever = VECTOR_CACHE.get(video_id)
    if retriever is None:
        try:
            splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
            docs = splitter.create_documents([transcript])
            embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
            vs = FAISS.from_documents(docs, embeddings)
            retriever = vs.as_retriever(search_type="similarity", search_kwargs={"k": 4})
            VECTOR_CACHE[video_id] = retriever
        except Exception as e:
            return f"Error building vector index: {e}"

    llm=ChatOpenAI(model="gpt-4o-mini",temperature=0.2)
    parser = StrOutputParser()

    prompt = PromptTemplate(
        template="""
    You are a helpful assistant. 
    Answer only from the provided transcript context. 
    If the context is insufficient, just say you don't know. 

    {context}

    Question: {question}
    """,
        input_variables=['context', 'question']
    )
    def format_docs(retrived_docs):
        context_text="\n\n".join(docs.page_content for docs in retrived_docs)
        return context_text
    parallel_chain=RunnableParallel({
        'context': retriever|RunnableLambda(format_docs),
        'question':RunnablePassthrough()
    })
    final_chain=parallel_chain|prompt|llm|parser
    
    try:
        answer = final_chain.invoke(query)
    except Exception as e:
        return f"Error generating answer: {e}"
    
    return answer or "I don't know."

