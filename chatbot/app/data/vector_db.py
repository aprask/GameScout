from openai import OpenAI # type: ignore
import os
from dotenv import load_dotenv # type: ignore
import faiss # type: ignore
import numpy as np # type: ignore
import core.processor as processor
import core.embedder as embedder
import core.parser as parser

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

faiss_file = "index.faiss"
DIMENSION = 512

def make_db(games):
    parsed_games = parser.run(games)
    chunked_games = processor.chunk_data(parsed_games)
    embedded_games = embedder.convert_text_into_embedding(chunked_games)
    if embedded_games:
        pass