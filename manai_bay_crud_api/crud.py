
# CRUD operations for Client entity
from uuid import uuid4
from schemas import ClientCreate, Client
from cassandra.query import SimpleStatement

def create_client(data: ClientCreate, session) -> Client:
    """
    Create a new client in the database.
    Args:
        data (ClientCreate): Client data to insert.
        session: Cassandra session.
    Returns:
        Client: The created client object.
    """
    id = uuid4()
    session.execute(
        """
        INSERT INTO clients (id, name, email)
        VALUES (%s, %s, %s)
        """,
        (id, data.name, data.email)
    )
    return Client(id=id, name=data.name, email=data.email)

def get_client(client_id: UUID, session) -> Client | None:
    """
    Retrieve a client by ID.
    Args:
        client_id (UUID): The client's unique identifier.
        session: Cassandra session.
    Returns:
        Client or None: The client object if found, else None.
    """
    result = session.execute(
        "SELECT * FROM clients WHERE id=%s", (client_id,)
    ).one()
    return Client(**result._asdict()) if result else None

def get_clients(session) -> list[Client]:
    """
    Retrieve all clients from the database.
    Args:
        session: Cassandra session.
    Returns:
        list[Client]: List of all client objects.
    """
    results = session.execute("SELECT * FROM clients")
    return [Client(**row._asdict()) for row in results]

def delete_client(client_id: UUID, session) -> dict:
    """
    Delete a client by ID.
    Args:
        client_id (UUID): The client's unique identifier.
        session: Cassandra session.
    Returns:
        dict: Confirmation of deletion.
    """
    session.execute("DELETE FROM clients WHERE id=%s", (client_id,))
    return {"deleted": True}
