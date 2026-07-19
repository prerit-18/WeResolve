import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

DATABASE_TYPE = os.getenv("DATABASE_TYPE", "sqlite")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./urbanpulse.db")

MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DB = os.getenv("MONGODB_DB", "weresolve")

# SQL Setup
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Mongo Setup
mongo_client = None
if DATABASE_TYPE == "mongodb":
    kwargs = {}
    try:
        import certifi
        kwargs["tlsCAFile"] = certifi.where()
    except ImportError:
        pass
    mongo_client = MongoClient(MONGODB_URI, **kwargs)

def get_db():
    if DATABASE_TYPE == "mongodb":
        from .repositories.mongo import MongoRepository
        repo = MongoRepository(mongo_client, MONGODB_DB)
        yield repo
    else:
        from .repositories.sql import SQLAlchemyRepository
        db = SessionLocal()
        try:
            repo = SQLAlchemyRepository(db)
            yield repo
        finally:
            db.close()
