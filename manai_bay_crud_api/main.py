
# Main FastAPI application for ManaiBay CRUD API
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from schemas import ClientCreate, Client, UserCreate, UserLogin, UserOut
from crud import create_client, get_client, get_clients, delete_client
from auth import get_password_hash, create_access_token, authenticate_user, get_current_user
from database import get_cassandra_session
from uuid import UUID, uuid4


app = FastAPI()  # Initialize FastAPI app
@app.post("/register", response_model=UserOut, summary="Register a new user")
def register(user: UserCreate, session=Depends(get_cassandra_session)):
    """
    Register a new user.
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
    session.execute(
        """
        INSERT INTO users (id, email, hashed_password)
        VALUES (%s, %s, %s)
        """,
        (user_id, user.email, hashed_password)
    )
    return UserOut(id=user_id, email=user.email)

@app.post("/login", summary="Login and get access token")
def login(user: UserLogin, session=Depends(get_cassandra_session)):
    """
    Authenticate user and return access token.
    Verifies credentials and returns a JWT token if successful.
    """
    db_user = authenticate_user(user.email, user.password, session)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token({"sub": db_user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use "*" just for testing; restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/clients/", response_model=Client, summary="Create a new client")
def create(client: ClientCreate, user=Depends(get_current_user), session=Depends(get_cassandra_session)):
    """
    Create a new client.
    Requires authentication. Stores client info in the database.
    """
    return create_client(client, session)

@app.get("/clients/", response_model=list[Client], summary="Get all clients")
def read_all(user=Depends(get_current_user), session=Depends(get_cassandra_session)):
    """
    Get all clients.
    Requires authentication. Returns a list of all clients.
    """
    return get_clients(session)

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