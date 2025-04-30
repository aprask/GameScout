from fastapi import FastAPI, Request
from app.api.routes import router
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

API_MANAGEMENT_KEY = os.environ.get("API_MANAGEMENT_KEY")

origins = ["http://localhost:4000", "http://127.0.0.1:4000", "http://server:4000"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
