from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


app.mount("/", StaticFiles(directory="dist", html=True), name="dist")

# api_app = FastAPI(title="api app")

# @api_app.get("/predict")
# async def predict(query_value):
#     return {}

# app.mount("/api", api_app)
