from fastapi import APIRouter
from ..core.run import make_db
from ..core.data.query import make_query
from app.api.model import QueryRequest
import threading
from ..core.run import get_game_titles
import os
from dotenv import load_dotenv  # type: ignore

load_dotenv()

API_MANAGEMENT_KEY = os.environ.get("API_MANAGEMENT_KEY")
APP_ENV = os.environ.get("APP_ENV")

router = APIRouter()


@router.get("/chatbot")
def read_root():
    return {"message": "Good"}


@router.post("/chatbot/rebuild")
async def rebuild_index():
    try:
        # TODO get reset bool
        db_thread = threading.Thread(target=make_db)
        db_thread.start()
        return {"status": "rebuilding db"}
    except Exception as e:
        return {"status": f"cannot rebuild db: {e}"}


@router.post("/chatbot/query")
async def query_index(req: QueryRequest):
    namespaces = get_game_titles()
    data = req.model_dump()
    query = data["query"]
    res = make_query(query, namespaces)
    return {"response": res}
