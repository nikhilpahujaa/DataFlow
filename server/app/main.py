from fastapi import FastAPI
from app.api.routes import router

app = FastAPI(title="Oracle to MongoDB/PostgreSQL Migration Tool")
 
app.include_router(router) 