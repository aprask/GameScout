from fastapi import APIRouter
from ..db_init import make_db
from ..core.data.query import make_query
from app.api.model import QueryRequestModel
from fastapi import Request
import threading

import os
from dotenv import load_dotenv  # type: ignore

load_dotenv()

API_MANAGEMENT_KEY = os.environ.get("API_MANAGEMENT_KEY")

router = APIRouter()


@router.get("/")
def read_root():
    return {"message": "Good"}


@router.post("/rebuild")
async def rebuild_index():
    try:
        db_thread = threading.Thread(target=make_db)
        db_thread.start()
        return {"status": "rebuilding db"}
    except Exception as e:
        return {"status": f"cannot rebuild db: {e}"}


@router.post("/query")
async def query_index(req: QueryRequestModel):
    data = req.model_dump()
    namespace_list = data["namespaces"]
    query = data["query"]
    game = data["game"]
    summary = data["summary"]
    in_list = False
    for name in namespace_list:
        if name["name"].lower() == game.lower():
            in_list = True
    if not in_list:
        return {"response": "Game does not exist in dataset"}
    collected_namespaces = []
    for namespace in namespace_list:
        collected_namespaces.append(namespace["name"])
    query = (
        f"Information related to {game} only. Here is a brief summary: {summary}. Do not confuse this with other games"
        + query
    )
    res = make_query(query, collected_namespaces, game, summary)
    return {"response": res}
