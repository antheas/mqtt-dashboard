import os
from cassandra.cluster import Cluster


class DatabaseManager:
  url = os.environ.get('DB_URL') or "db"

  def __init__(self):
    self.cluster = Cluster([self.url])
    self.session = self.cluster.connect()
