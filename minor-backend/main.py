from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import json
import logging
import traceback
from typing import List, Dict, Any
from insert_data import healthcare_data
from models.user import UserCreate, UserResponse, UserLogin, Token
from database import MongoDB
from utils.auth import get_password_hash, create_access_token
from datetime import timedelta

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI()

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

origins = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # Alternative dev port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Accept", "Authorization", "X-Requested-With"],
    expose_headers=["Content-Type"]
)

@app.on_event("startup")
async def startup_db_client():
    await MongoDB.connect_db()

@app.on_event("shutdown")
async def shutdown_db_client():
    await MongoDB.close_db()

@app.post("/api/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate):
    # Check if username already exists
    if await MongoDB.get_user_by_username(user.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email already exists
    if await MongoDB.get_user_by_email(user.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash the password
    hashed_password = get_password_hash(user.password)
    
    # Create user data dictionary
    user_data = user.dict()
    user_data["password"] = hashed_password
    
    # Insert user into database
    created_user = await MongoDB.create_user(user_data)
    
    # Remove password from response
    created_user.pop("password")
    return created_user

@app.post("/api/login")
async def login(user_credentials: UserLogin):
    user = await MongoDB.authenticate_user(user_credentials.username, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user["username"]},
        expires_delta=timedelta(minutes=30)
    )
    
    # Remove password from user data
    user.pop("password", None)
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": user
    }

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"New WebSocket connection established. Total active connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        logger.info(f"WebSocket connection closed. Total active connections: {len(self.active_connections)}")

    async def send_personal_message(self, message: str, websocket: WebSocket):
        try:
            await websocket.send_text(message)
        except Exception as e:
            logger.error(f"Error sending personal message: {e}")
            traceback.print_exc()

manager = ConnectionManager()

class HealthAssistantModel:
    def __init__(self):
        self.intents = healthcare_data["intents"]
        self.pattern_to_tag = {}
        for intent in self.intents:
            for pattern in intent["patterns"]:
                self.pattern_to_tag[pattern.lower()] = intent["tag"]

    def classify_intent(self, query: str) -> str:
        """Classify the intent of the user's query."""
        query = query.lower()
        
        # First try exact pattern matching
        for pattern in self.pattern_to_tag:
            if pattern in query:
                return self.pattern_to_tag[pattern]
        
        # If no exact match, try word-by-word matching
        query_words = set(query.split())
        for intent in self.intents:
            for pattern in intent["patterns"]:
                pattern_words = set(pattern.lower().split())
                if len(query_words.intersection(pattern_words)) >= 1:
                    return intent["tag"]
        
        return "default"

    def predict(self, query: str) -> Dict[str, Any]:
        """Generate a response based on the query."""
        try:
            intent_tag = self.classify_intent(query)
            
            # Find the matching intent
            matching_intent = None
            for intent in self.intents:
                if intent["tag"] == intent_tag:
                    matching_intent = intent
                    break
            
            if matching_intent:
                import random
                response = random.choice(matching_intent["responses"])
            else:
                response = "I'm not sure how to respond to that. Could you please rephrase your question?"

            return {
                "response": response,
                "intent": intent_tag,
                "confidence": 1.0 if matching_intent else 0.0
            }
        except Exception as e:
            logger.error(f"Prediction error: {e}")
            return {
                "response": "I'm having trouble processing your request. Could you try again?",
                "intent": "error",
                "confidence": 0.0
            }

health_model = HealthAssistantModel()

def log_interaction(user_id: str, query: str, response: Dict[str, Any]):
    """Log user interactions."""
    logger.info(f"User {user_id} Query: {query}")
    logger.info(f"Response: {response}")

@app.get("/test")
async def test():
    return FileResponse("static/index.html")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            try:
                # Receive message from client
                data = await websocket.receive_text()
                
                # Log incoming message
                logger.info(f"Received WebSocket message: {data}")
                
                # Parse the incoming message
                try:
                    message_data = json.loads(data)
                    question_text = message_data.get("message", "")
                except json.JSONDecodeError:
                    logger.warning(f"Invalid JSON received: {data}")
                    await websocket.send_text(json.dumps({
                        "error": "Invalid message format"
                    }))
                    continue

                # Validate input
                if not question_text:
                    logger.warning("Empty message received")
                    await websocket.send_text(json.dumps({
                        "error": "Empty message received"
                    }))
                    continue

                # Get AI response
                response = health_model.predict(question_text)
                
                # Send response back to client
                await websocket.send_text(json.dumps(response))
                
                # Log the interaction
                log_interaction("anonymous", question_text, response)
                
            except WebSocketDisconnect:
                manager.disconnect(websocket)
                break
            except Exception as e:
                logger.error(f"WebSocket message handling error: {str(e)}")
                traceback.print_exc()
                try:
                    await websocket.send_text(json.dumps({
                        "error": "Internal server error"
                    }))
                except:
                    pass
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        traceback.print_exc()
        manager.disconnect(websocket)

# Add this to run the server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
