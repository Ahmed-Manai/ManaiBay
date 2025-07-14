from pydantic import BaseModel, EmailStr
from uuid import UUID

class User(BaseModel):
    id: UUID
    email: EmailStr
    hashed_password: str
