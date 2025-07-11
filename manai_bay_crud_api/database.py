from cassandra.cluster import Cluster
from config import CASSANDRA_CONTACT_POINTS, CASSANDRA_KEYSPACE

cluster = Cluster(CASSANDRA_CONTACT_POINTS)
session = cluster.connect()
session.set_keyspace(CASSANDRA_KEYSPACE)