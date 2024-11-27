from pymongo import MongoClient
from dotenv import load_dotenv
import os
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
from datetime import datetime
from utils.auth import verify_password

# Load environment variables
load_dotenv()

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DATABASE_NAME = "health_assistant"

client = MongoClient(MONGODB_URI)
db = client[DATABASE_NAME]

# Collections
training_data = db.training_data
interactions = db.interactions

class MongoDB:
    client: Optional[AsyncIOMotorClient] = None
    database_name: str = "health_ai_db"

    @classmethod
    async def connect_db(cls):
        cls.client = AsyncIOMotorClient("mongodb://localhost:27017")
        
    @classmethod
    async def close_db(cls):
        if cls.client is not None:
            cls.client.close()
            
    @classmethod
    def get_db(cls):
        if cls.client is None:
            raise Exception("Database not connected. Call connect_db first.")
        return cls.client[cls.database_name]

    @classmethod
    async def get_user_by_email(cls, email: str):
        db = cls.get_db()
        return await db.users.find_one({"email": email})
    
    @classmethod
    async def get_user_by_username(cls, username: str):
        db = cls.get_db()
        return await db.users.find_one({"username": username})
    
    @classmethod
    async def create_user(cls, user_data: dict):
        db = cls.get_db()
        user_data["created_at"] = datetime.utcnow()
        result = await db.users.insert_one(user_data)
        return await db.users.find_one({"_id": result.inserted_id})

    @classmethod
    async def authenticate_user(cls, username: str, password: str):
        user = await cls.get_user_by_username(username)
        if not user:
            return None
        if not verify_password(password, user["password"]):
            return None
        return user

def insert_health_data(data):
    """Insert training data into MongoDB"""
    return training_data.insert_many(data)

def get_training_data():
    """Retrieve all training data"""
    return list(training_data.find({}, {'_id': 0}))

def log_interaction(user_id, query, response):
    """Log user interaction with the model"""
    interaction = {
        'user_id': user_id,
        'query': query,
        'response': response,
        'timestamp': datetime.utcnow()
    }
    return interactions.insert_one(interaction)
