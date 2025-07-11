from uuid import uuid4
from database import session
from schemas import ClientCreate, Client
from cassandra.query import SimpleStatement

def create_client(data: ClientCreate):
    id = uuid4()
    session.execute(
        """
        INSERT INTO clients (id, name, email)
        VALUES (%s, %s, %s)
        """,
        (id, data.name, data.email)
    )
    return {"id": id, **data.dict()}

def get_client(client_id):
    result = session.execute(
        "SELECT * FROM clients WHERE id=%s", (client_id,)
    ).one()
    return dict(result._asdict()) if result else None

def get_clients():
    results = session.execute("SELECT * FROM clients")
    return [dict(row._asdict()) for row in results]

def delete_client(client_id):
    session.execute("DELETE FROM clients WHERE id=%s", (client_id,))
    return {"deleted": True}
