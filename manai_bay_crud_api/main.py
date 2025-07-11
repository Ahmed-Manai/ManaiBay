from fastapi import FastAPI, HTTPException
from schemas import ClientCreate, Client
from crud import create_client, get_client, get_clients, delete_client
from uuid import UUID

app = FastAPI()

@app.post("/clients/", response_model=Client)
def create(client: ClientCreate):
    return create_client(client)

@app.get("/clients/", response_model=list[Client])
def read_all():
    return get_clients()

@app.get("/clients/{client_id}", response_model=Client)
def read(client_id: UUID):
    client = get_client(client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client

@app.delete("/clients/{client_id}")
def delete(client_id: UUID):
    return delete_client(client_id)
