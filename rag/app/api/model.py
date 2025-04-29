from pydantic import BaseModel
from typing import List


class Namespace(BaseModel):
    name: str


class RequestModel(BaseModel):
    query: str
    namespaces: List[Namespace]
