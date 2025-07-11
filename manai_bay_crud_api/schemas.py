from pydantic import BaseModel, EmailStr
from uuid import UUID

class ClientBase(BaseModel):
    name: str
    email: EmailStr

class ClientCreate(ClientBase):
    pass

class Client(ClientBase):
    id: UUID    