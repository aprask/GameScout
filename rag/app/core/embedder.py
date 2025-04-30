from openai import OpenAI  # type: ignore
import os
import numpy as np  # type: ignore
from dotenv import load_dotenv  # type: ignore
import time

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

print(f"KEY: {os.getenv("OPENAI_API_KEY")}")
print(f"KEY: {os.getenv("OPENAI_API_KEY")}")
print(f"KEY: {os.getenv("OPENAI_API_KEY")}")
print(f"KEY: {os.getenv("OPENAI_API_KEY")}")
print(f"KEY: {os.getenv("OPENAI_API_KEY")}")
print(f"KEY: {os.getenv("OPENAI_API_KEY")}")
print(f"KEY: {os.getenv("OPENAI_API_KEY")}")


def normalize_vector_chunk(vector_chunk):
    vector = np.array(vector_chunk)
    magnitude = np.linalg.norm(vector)
    if magnitude == 0:
        return vector
    return vector / magnitude


def convert_text_into_embedding(chunks, model="text-embedding-ada-002"):
    try:
        res = client.embeddings.create(input=chunks, model=model)
        time.sleep(1)
        return [normalize_vector_chunk(item.embedding) for item in res.data][0].tolist()
    except Exception as e:
        print(f"Error generating embeddings: {e}")
        return None
