from openai import OpenAI  # type: ignore
import os
from dotenv import load_dotenv  # type: ignore
from pinecone import Pinecone, ServerlessSpec  # type: ignore
import numpy as np  # type: ignore

load_dotenv()
pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
index = os.getenv("INDEX_NAME")


def create_pinecone_index(dimension=1536):
    try:
        if index in pc.list_indexes().names():
            pc.delete_index(index)
            print(f"Index '{index}' deleted.")
        pc.create_index(
            name=index,
            dimension=dimension,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1"),
        )
        print(f"Index '{index}' created successfully.")
    except Exception as e:
        print(f"Error making index in Pinecone: {e}")


def create_vectors(namespace, data, db, data_embeddings):
    vectors = [(f"{namespace}", data_embeddings, {"chunk": data, "source": namespace})]
    try:
        print(vectors)
        db.upsert(vectors=vectors, namespace=namespace)
    except Exception as e:
        print(f"Error updating Pinecone index: {e}")


def pinecone_init(title, embedding, chunk, reset=False):
    if reset:
        create_pinecone_index()
    pc_db = pc.Index(index)
    if pc_db is None:
        return
    create_vectors(namespace=title, data=chunk, db=pc_db, data_embeddings=embedding)
