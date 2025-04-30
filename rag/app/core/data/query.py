from openai import OpenAI  # type: ignore
import os
from dotenv import load_dotenv  # type: ignore
from pinecone import Pinecone  # type: ignore
import numpy as np  # type: ignore
from app.core.embedder import convert_text_into_embedding
import json

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
index = os.getenv("INDEX_NAME")


def normalize_vector_chunk(vector_chunk):
    vector = np.array(vector_chunk)
    magnitude = np.linalg.norm(vector)
    if magnitude == 0:
        return vector
    return vector / magnitude


def make_query_vector(query):
    query_embedding = convert_text_into_embedding(query)
    return normalize_vector_chunk(query_embedding)


def ret_k_chunks(query, namespaces, k=10):
    try:
        db = pc.Index(index)
        query_vector = np.array(query).astype("float32").tolist()
        all_matches = []
        for namespace in namespaces:
            response = db.query(
                vector=query_vector,
                top_k=k,
                include_metadata=True,
                namespace=namespace,
            )
            all_matches.extend(response["matches"])
        all_matches.sort(key=lambda x: x["score"], reverse=True)
        relevant_text_chunks = [match["metadata"]["chunk"] for match in all_matches[:k]]
        return relevant_text_chunks
    except Exception as e:
        print(f"Error querying Pinecone: {e}")
        return None


def llm_proc(query, chunks, game, summary, model="gpt-3.5-turbo"):
    if not chunks:
        print("No relevant information found for query")
        return None
    print(chunks)
    try:
        llm_response = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "user",
                    "content": f"""
                        ### Prompt
                        You are a gaming chatbot
                        You are only to give information about the following video game: {game}
                        Do not give information about any video games not called: {game}
                        This is a brief summary about this game: {summary}
                        Respond in a lively and energetic fashion
                        Please extract only the most relevant information about the query: {query}, considering the perspective of a gamer.
                        You will extract information from the provided details: {chunks}.
                        Ensure the response is precise, professional, and focused on key points that are directly useful to a gaming audience.
                        ### Additional
                        Clear Markdown headers and bulleted points to present information effectively.
                        Avoid unnecessary plain text formatting and extraneous details.
                        Do not use links (or place links within the response)
                        """,
                }
            ],
        )
        return llm_response.choices[0].message.content
    except Exception as e:
        print(f"Error processing data with LLM: {e}")
        return None


def make_query(query, namespaces, game, summary):
    vector = make_query_vector(query)
    rel_chunks = ret_k_chunks(vector, namespaces)
    llm_res = llm_proc(query, rel_chunks, game, summary)
    print(llm_res)
    return llm_res
