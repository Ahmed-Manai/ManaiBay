
# Pydantic models for request and response validation
from pydantic import BaseModel, EmailStr
from uuid import UUID

class ClientBase(BaseModel):
    """
    Base model for client data.
    """
    name: str  # Client's name
    email: EmailStr  # Client's email address

class ClientCreate(ClientBase):
    """
    Model for creating a new client (inherits from ClientBase).
    """
    pass

class Client(ClientBase):
    """
    Model for returning client data, includes ID.
    """
    id: UUID    # Unique identifier for the client

# User schemas
class UserCreate(BaseModel):
    """
    Model for user registration.
    """
    first_name: str
    last_name: str
    email: EmailStr  # User's email address
    password: str    # User's password
    phone: str
    location: str
    role: str = "user"  # User's role ('admin' or 'user')

class UserLogin(BaseModel):
    """
    Model for user login.
    """
    email: EmailStr  # User's email address
    password: str    # User's password

class UserOut(BaseModel):
    """
    Model for returning user data.
    """
    id: UUID        # Unique identifier for the user
    first_name: str
    last_name: str
    email: EmailStr # User's email address
    phone: str
    location: str
    role: str
    created_date: str
    updated_date: str