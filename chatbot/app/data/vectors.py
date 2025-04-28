from openai import OpenAI # type: ignore
import os
from dotenv import load_dotenv # type: ignore
import faiss # type: ignore
import numpy as np # type: ignore

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

faiss_file = "index.faiss"

def make_db(embedded_games):
    embeddings_np = np.array(embedded_games).astype("float32") # converting our vectors into f32 w np
    dimension = embeddings_np.shape[1] # we need the cols since they rep the dim, whereas rows are # of vectors
    index = faiss.IndexFlatIP(dimension) 
    index.add(embeddings_np)
    faiss.write_index(index, faiss_file)