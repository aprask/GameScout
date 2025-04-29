from fastapi import APIRouter
from ..core.run import make_db
from ..core.data.query import make_query
from app.api.model import RequestModel
import threading

import os
from dotenv import load_dotenv  # type: ignore

load_dotenv()

API_MANAGEMENT_KEY = os.environ.get("API_MANAGEMENT_KEY")

router = APIRouter()


@router.get("/chatbot")
def read_root():
    return {"message": "Good"}


@router.post("/chatbot/rebuild")
async def rebuild_index():
    try:
        db_thread = threading.Thread(target=make_db)
        db_thread.start()
        return {"status": "rebuilding db"}
    except Exception as e:
        return {"status": f"cannot rebuild db: {e}"}


@router.post("/chatbot/query")
async def query_index(req: RequestModel):
    data = req.model_dump()
    namespace_list = data["namespaces"]
    query = data["query"]
    collected_namespaces = []
    for namespace in namespace_list:
        collected_namespaces.append(namespace["name"])
    res = make_query(query, collected_namespaces)
    return {"response": res}
