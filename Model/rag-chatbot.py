from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableParallel,RunnablePassthrough,RunnableLambda
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
load_dotenv()

video_id = "MWKh7oZkXxc"

try:
    yt=YouTubeTranscriptApi()
    transcript_list = yt.fetch(video_id)
    transcript=" ".join(snippet.text for snippet in transcript_list )

except TranscriptsDisabled:
    print("No captions available for this video.")

splitter=RecursiveCharacterTextSplitter(chunk_size=1000,chunk_overlap=200)
chunks=splitter.create_documents([transcript])
embeddings=OpenAIEmbeddings(model="text-embedding-3-small")
vector_stores=FAISS.from_documents(chunks,embeddings)
retriver=vector_stores.as_retriever(search_type="similarity",search_kwags={"k":4})
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
    'context': retriver|RunnableLambda(format_docs),
    'question':RunnablePassthrough()
})
final_chain=parallel_chain|prompt|llm|parser
answer=final_chain.invoke('what is this video taking about')
print(answer)