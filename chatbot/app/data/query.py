from openai import OpenAI # type: ignore
import os
from dotenv import load_dotenv # type: ignore
import faiss # type: ignore
import numpy as np # type: ignore
from app.core.embedder import convert_text_into_embedding

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

faiss_file = "index.faiss"

def load_vector_db():
    return faiss.read_index(faiss_file)

def find_relevant_chunks(indices):
    pass

def process_data_llm(query, chunks, model="o4-mini"):
    llm_response = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "user",
                "content": f"""
                You are a game chatbot.
                Give users relevant information about video games based on the information provided.

                Please gather only relevant information about {query} based on these details: {chunks}. 

                Do not give more information than necessary.
                """,
            }
        ],
    )
    return llm_response.choices[0].message.content

def query_vector_db(query, k=10):
    query_embed = convert_text_into_embedding(query)
    query_embedding_np = np.array(query_embed).astype("float32")
    index = load_vector_db()
    distances, indices = index.search(query_embedding_np, k)
    