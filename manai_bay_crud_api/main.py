from fastapi import FastAPI, HTTPException, Depends
from schemas import ClientCreate, Client, UserCreate, UserLogin, UserOut
from crud import create_client, get_client, get_clients, delete_client
from auth import get_password_hash, create_access_token, authenticate_user, get_current_user
from uuid import UUID
from fastapi.middleware.cors import CORSMiddleware
from schemas import ClientCreate
from database import session


app = FastAPI()
@app.post("/register", response_model=UserOut)
def register(user: UserCreate):
    from database import session
    from uuid import uuid4
    if session.execute("SELECT * FROM users WHERE email=%s ALLOW FILTERING", (user.email,)).one():
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
    return {"id": user_id, "email": user.email}

@app.post("/login")
def login(user: UserLogin):
    db_user = authenticate_user(user.email, user.password)
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

@app.post("/clients/", response_model=Client)
def create(client: ClientCreate, user=Depends(get_current_user)):
    return create_client(client)

@app.get("/clients/", response_model=list[Client])
def read_all(user=Depends(get_current_user)):
    return get_clients()

@app.get("/clients/{client_id}", response_model=Client)
def read(client_id: UUID, user=Depends(get_current_user)):
    client = get_client(client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client

@app.delete("/clients/{client_id}")
def delete(client_id: UUID, user=Depends(get_current_user)):
    return delete_client(client_id)

@app.put("/clients/{client_id}", response_model=Client)
def update(client_id: UUID, data: ClientCreate, user=Depends(get_current_user)):
    client = get_client(client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    session.execute(
        """
        UPDATE clients SET name=%s, email=%s WHERE id=%s
        """,
        (data.name, data.email, client_id)
    )
    return {"id": client_id, **data.dict()}