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
        email TEXT,
        hashed_password TEXT
    );
    ''')
    return session