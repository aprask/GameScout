from openai import OpenAI  # type: ignore
import os
import numpy as np  # type: ignore
from dotenv import load_dotenv  # type: ignore

load_dotenv()

client = OpenAI(api_key=os.getenv("OPEN_AI_KEY"))


def normalize_vector_chunk(vector_chunk):
    vector = np.array(vector_chunk)
    magnitude = np.linalg.norm(vector)
    if magnitude == 0:
        return vector
    return vector / magnitude


def convert_text_into_embedding(text="teststring", model="text-embedding-ada-002"):
    try:
        res = client.embeddings.create(input=text, model=model).data[0].embedding
        return normalize_vector_chunk(res)
    except RateLimitError as e:  # type: ignore
        print(f"[Quota Exceeded] Error generating embedding for chunk '{text}': {e}")
        print("Please check your OpenAI account usage or upgrade your plan.")
        return None
    except OpenAIError as e:  # type: ignore
        print(f"[OpenAI API Error] Error generating embedding for chunk '{text}': {e}")
        return None
    except Exception as e:
        print(f"[Unexpected Error] Error generating embedding for chunk '{text}': {e}")
        return None
