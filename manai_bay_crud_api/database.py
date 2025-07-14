from cassandra.cluster import Cluster
from config import CASSANDRA_CONTACT_POINTS, CASSANDRA_KEYSPACE

cluster = Cluster(CASSANDRA_CONTACT_POINTS)
session = cluster.connect()
session.set_keyspace(CASSANDRA_KEYSPACE)

# Create users table if not exists
session.execute('''
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email TEXT,
    hashed_password TEXT
);
''')