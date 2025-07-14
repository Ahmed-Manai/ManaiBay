
# CRUD operations for Client entity
from uuid import uuid4, UUID
from schemas import ClientCreate, Client, UserOut
def get_users(session) -> list[UserOut]:
    """
    Retrieve all registered users from the database.
    Args:
        session: Cassandra session.
    Returns:
        list[UserOut]: List of all registered users.
    """
    results = session.execute("SELECT id, first_name, last_name, email, phone, location, role, created_date, updated_date FROM users")
    users = []
    for row in results:
        user_dict = {
            "id": row.id,
            "first_name": getattr(row, "first_name", "") or "",
            "last_name": getattr(row, "last_name", "") or "",
            "email": getattr(row, "email", "") or "",
            "phone": getattr(row, "phone", "") or "",
            "location": getattr(row, "location", "") or "",
            "role": getattr(row, "role", None) or "user",
            "created_date": getattr(row, "created_date", "") or "",
            "updated_date": getattr(row, "updated_date", "") or ""
        }
        users.append(user_dict)
    return users
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
