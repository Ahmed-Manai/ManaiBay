import os

# Cassandra database contact points (hosts). Can be set via environment variable.
CASSANDRA_CONTACT_POINTS = os.getenv('CASSANDRA_CONTACT_POINTS', '127.0.0.1').split(',')

# Cassandra keyspace name. Can be set via environment variable.
CASSANDRA_KEYSPACE = os.getenv('CASSANDRA_KEYSPACE', 'clientkeyspace')