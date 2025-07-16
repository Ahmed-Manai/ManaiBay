# Product schemas
from typing import Optional, List
from pydantic import BaseModel
from uuid import uuid4, UUID

class ProductCreate(BaseModel):
    title: str
    description: str
    image_data: Optional[str] = None  # Base64 encoded image data
    image_filename: Optional[str] = None
    price: float

class ProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_data: Optional[str] = None
    image_filename: Optional[str] = None
    price: Optional[float] = None

class ReviewCreate(BaseModel):
    user_name: str
    rating: int
    comment: str

class ReviewOut(BaseModel):
    id: UUID
    product_id: UUID
    user_name: str
    rating: int
    comment: str
    created_date: str

class ProductOut(BaseModel):
    id: UUID
    title: str
    description: str
    image_data: Optional[str] = None
    image_filename: Optional[str] = None
    price: float
    created_date: Optional[str]
    updated_date: Optional[str]
    reviews: Optional[List[ReviewOut]] = []

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
