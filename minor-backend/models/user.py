from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = None
    
class UserInDB(UserCreate):
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    
class UserResponse(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str]
    created_at: datetime

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
