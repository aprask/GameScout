from pydantic import BaseModel
from typing import List


class Namespace(BaseModel):
    name: str


class QueryRequestModel(BaseModel):
    query: str
    namespaces: List[Namespace]
    game: str
    summary: str



