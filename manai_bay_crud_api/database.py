from cassandra.cluster import Cluster
from config import CASSANDRA_CONTACT_POINTS, CASSANDRA_KEYSPACE
from fastapi import Depends

# Dependency function to provide a Cassandra session for FastAPI endpoints
def get_cassandra_session():
    # Connect to Cassandra cluster
    cluster = Cluster(CASSANDRA_CONTACT_POINTS)
    session = cluster.connect()
    # Set the keyspace for queries
    session.set_keyspace(CASSANDRA_KEYSPACE)
    # Ensure the users table exists
    session.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        first_name TEXT,
        last_name TEXT,
        email TEXT,
        hashed_password TEXT,
        phone TEXT,
        location TEXT,
        role TEXT,
        created_date TEXT,
        updated_date TEXT
    );
    ''')
    # Ensure the products table exists
    session.execute('''
    CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY,
        title TEXT,
        description TEXT,
        image_data TEXT,
        image_filename TEXT,
        price DOUBLE,
        created_date TEXT,
        updated_date TEXT
    );
    ''')
    
    # Ensure the product_reviews table exists
    session.execute('''
    CREATE TABLE IF NOT EXISTS product_reviews (
        id UUID PRIMARY KEY,
        product_id UUID,
        user_name TEXT,
        rating INT,
        comment TEXT,
        created_date TEXT
    );
    ''')
    return session
