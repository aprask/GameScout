from openai import OpenAI  # type: ignore
import os
import numpy as np  # type: ignore
from dotenv import load_dotenv  # type: ignore

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def normalize_vector_chunk(vector_chunk):
    vector = np.array(vector_chunk)
    magnitude = np.linalg.norm(vector)
    if magnitude == 0:
        return vector
    return vector / magnitude


def convert_text_into_embedding(chunks, model="text-embedding-ada-002"):
    embeddings = [] 
    print(len(chunks))
    i = 0
    for text in chunks:
        print(i)
        try:
            res = client.embeddings.create(input=text, model=model).data[0].embedding
            embeddings.append(normalize_vector_chunk(res))
        except Exception as e:
            print(f"[Unexpected Error] Error generating embedding for chunk '{text}': {e}")
            return None
        i+=1
    return embeddings
