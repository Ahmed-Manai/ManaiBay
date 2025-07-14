from pydantic import BaseModel, EmailStr
from uuid import UUID

# Pydantic model representing a user in the system
class User(BaseModel):
    id: UUID              # Unique identifier for the user
    email: EmailStr       # User's email address
    hashed_password: str  # Hashed password for authentication
