from fastapi import FastAPI, Request
from app.api.routes import router
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

load_dotenv()

API_MANAGEMENT_KEY = os.environ.get("API_MANAGEMENT_KEY")

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost",
    "http://client",
    "http://localhost:80",
    "http://64.225.31.139",
    "https://64.225.31.139",
    "https://gamescout.xyz",
    "http://gamescout.xyz",
    "https://www.gamescout.xyz",
]


@app.middleware("http")
async def origin_verif(req: Request, call_next):
    origin_header = req.headers.get("Origin")
    if not origin_header:
        return await call_next(req)
    if origin_header not in origins:
        return JSONResponse(status_code=401, content={"detail": "Invalid origin"})
    return await call_next(req)


@app.middleware("http")
async def auth_header_verif(req: Request, call_next):
    auth_header = req.headers.get("Authorization")
    if not auth_header:
        return JSONResponse(
            status_code=401, content={"detail": "Authorization header missing"}
        )
    if auth_header != API_MANAGEMENT_KEY:
        return JSONResponse(status_code=401, content={"detail": "Invalid token"})
    return await call_next(req)


app.include_router(router)
