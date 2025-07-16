from schemas import ProductCreate, ProductOut, ProductUpdate, ReviewCreate, ReviewOut
from datetime import datetime
# CRUD operations for Client entity
from uuid import uuid4, UUID
from schemas import ClientCreate, Client, UserOut

def create_product(data: ProductCreate, session) -> ProductOut:
    id = uuid4()
    now = datetime.utcnow().isoformat()
    session.execute(
        """
        INSERT INTO products (id, title, description, image_data, image_filename, price, created_date, updated_date)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (id, data.title, data.description, data.image_data, data.image_filename, float(data.price), now, now)
    )
    return ProductOut(
        id=id, 
        title=data.title, 
        description=data.description, 
        image_data=data.image_data,
        image_filename=data.image_filename,
        price=float(data.price), 
        created_date=now, 
        updated_date=now,
        reviews=[]
    )

def get_product_reviews(product_id: UUID, session) -> list[ReviewOut]:
    results = session.execute("SELECT * FROM product_reviews WHERE product_id=%s ALLOW FILTERING", (product_id,))
    reviews = []
    for row in results:
        reviews.append(ReviewOut(
            id=row.id,
            product_id=row.product_id,
            user_name=row.user_name,
            rating=row.rating,
            comment=row.comment,
            created_date=row.created_date
        ))
    return reviews

def get_product(product_id: UUID, session) -> ProductOut | None:
    row = session.execute("SELECT * FROM products WHERE id=%s", (product_id,)).one()
    if not row:
        return None
    
    reviews = get_product_reviews(product_id, session)
    
    return ProductOut(
        id=row.id,
        title=row.title,
        description=row.description,
        image_data=getattr(row, "image_data", None),
        image_filename=getattr(row, "image_filename", None),
        price=row.price,
        created_date=getattr(row, "created_date", None),
        updated_date=getattr(row, "updated_date", None),
        reviews=reviews
    )

def get_products(session, search: str = None) -> list[ProductOut]:
    if search:
        # This is not efficient for Cassandra, but for the sake of the example, we will use it.
        # In a real-world scenario, you would use a search index like Elasticsearch or a secondary index in Cassandra.
        query = "SELECT * FROM products"
        results = session.execute(query)
        products = [
            product for product in results
            if search.lower() in product.title.lower()
        ]
    else:
        query = "SELECT * FROM products"
        results = session.execute(query)
        products = list(results)

    output = []
    for row in products:
        reviews = get_product_reviews(row.id, session)
        output.append(ProductOut(
            id=row.id,
            title=row.title,
            description=row.description,
            image_data=getattr(row, "image_data", None),
            image_filename=getattr(row, "image_filename", None),
            price=row.price,
            created_date=getattr(row, "created_date", None),
            updated_date=getattr(row, "updated_date", None),
            reviews=reviews
        ))
    return output

def update_product(product_id: UUID, data: ProductUpdate, session) -> ProductOut | None:
    now = datetime.utcnow().isoformat()
    row = session.execute("SELECT * FROM products WHERE id=%s", (product_id,)).one()
    if not row:
        return None
    
    # Build update query dynamically based on provided fields
    update_fields = []
    update_values = []
    
    if data.title is not None:
        update_fields.append("title=%s")
        update_values.append(data.title)
    if data.description is not None:
        update_fields.append("description=%s")
        update_values.append(data.description)
    if data.image_data is not None:
        update_fields.append("image_data=%s")
        update_values.append(data.image_data)
    if data.image_filename is not None:
        update_fields.append("image_filename=%s")
        update_values.append(data.image_filename)
    if data.price is not None:
        update_fields.append("price=%s")
        update_values.append(float(data.price))
    
    update_fields.append("updated_date=%s")
    update_values.append(now)
    update_values.append(product_id)
    
    query = f"UPDATE products SET {', '.join(update_fields)} WHERE id=%s"
    session.execute(query, update_values)
    
    return get_product(product_id, session)

def delete_product(product_id: UUID, session) -> dict:
    row = session.execute("SELECT * FROM products WHERE id=%s", (product_id,)).one()
    if not row:
        return {"detail": "Product not found"}
    
    # Delete associated reviews first
    session.execute("DELETE FROM product_reviews WHERE product_id=%s", (product_id,))
    # Delete the product
    session.execute("DELETE FROM products WHERE id=%s", (product_id,))
    return {"detail": "Product deleted"}

def create_review(product_id: UUID, data: ReviewCreate, session) -> ReviewOut:
    review_id = uuid4()
    now = datetime.utcnow().isoformat()
    session.execute(
        """
        INSERT INTO product_reviews (id, product_id, user_name, rating, comment, created_date)
        VALUES (%s, %s, %s, %s, %s, %s)
        """,
        (review_id, product_id, data.user_name, data.rating, data.comment, now)
    )
    return ReviewOut(
        id=review_id,
        product_id=product_id,
        user_name=data.user_name,
        rating=data.rating,
        comment=data.comment,
        created_date=now
    )

def delete_review(review_id: UUID, session) -> dict:
    row = session.execute("SELECT * FROM product_reviews WHERE id=%s", (review_id,)).one()
    if not row:
        return {"detail": "Review not found"}
    session.execute("DELETE FROM product_reviews WHERE id=%s", (review_id,))
    return {"detail": "Review deleted"}


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
