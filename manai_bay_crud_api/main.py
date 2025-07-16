from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from uuid import UUID, uuid4
from datetime import datetime

# Import schemas
from schemas import ClientCreate, Client, UserCreate, UserLogin, UserOut, ProductCreate, ProductOut, ProductUpdate, ReviewCreate, ReviewOut

# Import CRUD functions
from crud import (
    create_client, get_client, get_clients, delete_client, get_users,
    create_product, get_product, get_products, update_product, delete_product,
    create_review, delete_review
)

# Import auth functions
from auth import get_password_hash, create_access_token, authenticate_user, get_current_user, admin_required

# Import database
from database import get_cassandra_session

app = FastAPI()  # Initialize FastAPI app

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use "*" just for testing; restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Product CRUD endpoints
from typing import Optional

@app.get("/products/", response_model=list[ProductOut], summary="Get all products")
def read_all_products(search: Optional[str] = None, session=Depends(get_cassandra_session)):
    return get_products(session, search)

@app.get("/products/{product_id}", response_model=ProductOut, summary="Get product by ID")
def read_product(product_id: UUID, session=Depends(get_cassandra_session)):
    product = get_product(product_id, session)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.post("/products/", response_model=ProductOut, summary="Create a new product")
def create_new_product(data: ProductCreate, user=Depends(admin_required), session=Depends(get_cassandra_session)):
    return create_product(data, session)

@app.put("/products/{product_id}", response_model=ProductOut, summary="Update a product by ID")
def update_existing_product(product_id: UUID, data: ProductUpdate, user=Depends(admin_required), session=Depends(get_cassandra_session)):
    product = update_product(product_id, data, session)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.delete("/products/{product_id}", summary="Delete a product by ID")
def delete_existing_product(product_id: UUID, user=Depends(admin_required), session=Depends(get_cassandra_session)):
    return delete_product(product_id, session)

# User management endpoints
@app.get("/users/", response_model=list[UserOut], summary="Get all registered users")
def read_all_users(user=Depends(admin_required), session=Depends(get_cassandra_session)):
    """
    Get all registered users.
    Returns a list of all users registered via the register page.
    """
    try:
        users = get_users(session)
        return users
    except Exception as e:
        import traceback
        print("Validation or DB error (GET /users/):", e)
        print(traceback.format_exc())
        raise HTTPException(status_code=422, detail=str(e))

@app.delete("/users/{user_id}", summary="Delete a user by ID")
def delete_user(user_id: UUID, user=Depends(admin_required), session=Depends(get_cassandra_session)):
    """
    Delete a user by ID.
    Removes user from the database.
    """
    result = session.execute("SELECT * FROM users WHERE id=%s", (user_id,)).one()
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    session.execute("DELETE FROM users WHERE id=%s", (user_id,))
    return {"detail": "User deleted"}

@app.put("/users/{user_id}", response_model=UserOut, summary="Update a user by ID")
def update_user(user_id: UUID, data: UserCreate, user=Depends(admin_required), session=Depends(get_cassandra_session)):
    """
    Update a user by ID.
    Requires admin role. Updates user info in the database.
    Returns the updated user object.
    """
    existing_user = session.execute("SELECT * FROM users WHERE id=%s", (user_id,)).one()
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")
    session.execute(
        """
        UPDATE users SET first_name=%s, last_name=%s, email=%s, phone=%s, location=%s, role=%s WHERE id=%s
        """,
        (data.first_name, data.last_name, data.email, data.phone, data.location, data.role, user_id)
    )
    return UserOut(
        id=user_id,
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        phone=data.phone,
        location=data.location,
        role=data.role,
        created_date=existing_user.created_date,
        updated_date=existing_user.updated_date
    )

# Authentication endpoints
@app.post("/register", response_model=UserOut, summary="Register a new user")
def register(user: UserCreate, session=Depends(get_cassandra_session)):
    """
    Register a new user with additional fields and role.
    Checks if the email is already registered, hashes the password, and inserts the user into the database.
    Returns the created user info.
    """
    existing_user = session.execute(
        "SELECT * FROM users WHERE email=%s ALLOW FILTERING", (user.email,)
    ).one()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_id = uuid4()
    hashed_password = get_password_hash(user.password)
    now = datetime.utcnow().isoformat()
    session.execute(
        """
        INSERT INTO users (id, first_name, last_name, email, hashed_password, phone, location, role, created_date, updated_date)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (user_id, user.first_name, user.last_name, user.email, hashed_password, user.phone, user.location, user.role, now, now)
    )
    return UserOut(
        id=user_id,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        phone=user.phone,
        location=user.location,
        role=user.role,
        created_date=now,
        updated_date=now
    )

@app.post("/login", summary="Login and get access token")
def login(user: UserLogin, session=Depends(get_cassandra_session)):
    """
    Authenticate user and return access token.
    Verifies credentials and returns a JWT token if successful.
    """
    db_user = authenticate_user(user.email, user.password, session)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token({"sub": db_user["email"], "role": db_user["role"]})
    return {"access_token": access_token, "token_type": "bearer", "role": db_user["role"]}

# Client CRUD endpoints
@app.post("/clients/", response_model=Client, summary="Create a new client")
def create(client: ClientCreate, user=Depends(get_current_user), session=Depends(get_cassandra_session)):
    """
    Create a new client.
    Requires authentication. Stores client info in the database.
    """
    try:
        return create_client(client, session)
    except Exception as e:
        import traceback
        print("Validation or DB error:", e)
        print(traceback.format_exc())
        raise HTTPException(status_code=422, detail=str(e))

@app.get("/clients/", response_model=list[Client], summary="Get all clients")
def read_all(user=Depends(get_current_user), session=Depends(get_cassandra_session)):
    """
    Get all clients.
    Requires authentication. Returns a list of all clients.
    """
    try:
        return get_clients(session)
    except Exception as e:
        import traceback
        print("Validation or DB error (GET /clients/):", e)
        print(traceback.format_exc())
        raise HTTPException(status_code=422, detail=str(e))

@app.get("/clients/{client_id}", response_model=Client, summary="Get a client by ID")
def read(client_id: UUID, user=Depends(get_current_user), session=Depends(get_cassandra_session)):
    """
    Get a client by ID.
    Requires authentication. Returns client info if found.
    """
    client = get_client(client_id, session)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client

@app.delete("/clients/{client_id}", summary="Delete a client")
def delete(client_id: UUID, user=Depends(get_current_user), session=Depends(get_cassandra_session)):
    """
    Delete a client by ID.
    Requires authentication. Removes client from the database.
    """
    return delete_client(client_id, session)

@app.put("/clients/{client_id}", response_model=Client, summary="Update a client")
def update(client_id: UUID, data: ClientCreate, user=Depends(get_current_user), session=Depends(get_cassandra_session)):
    """
    Update a client by ID.
    Requires authentication. Updates client info in the database.
    Returns the updated client object.
    """
    client = get_client(client_id, session)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    session.execute(
        """
        UPDATE clients SET name=%s, email=%s WHERE id=%s
        """,
        (data.name, data.email, client_id)
    )

    return Client(id=client_id, name=data.name, email=data.email)

# --- Run FastAPI app with Uvicorn when executed directly ---
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
