from openai import OpenAI  # type: ignore
import os
from dotenv import load_dotenv  # type: ignore
import faiss  # type: ignore
import numpy as np  # type: ignore
from app.core.embedder import convert_text_into_embedding

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))