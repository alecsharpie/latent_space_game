from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


app.mount("/", StaticFiles(directory="dist", html=True), name="dist")
app.mount("/static", StaticFiles(directory="static"), name="static")

# @app.get('/favicon.ico')
# async def favicon():
#     return FileResponse('static/favicon.ico')


# api_app = FastAPI(title="api app")

# @api_app.get("/predict")
# async def predict(query_value):
#     return {}

# app.mount("/api", api_app)
