import os
from influxdb_client import InfluxDBClient


class DatabaseManager:

  def __init__(self):
    self.client = InfluxDBClient.from_env_properties()
    self.query_api = self.client.query_api()

  def query(self, start="-15m", stop="now()", topic="", group="", client="", sensor="", unit=""):
    query = 'from(bucket: "%s")' % (os.environ.get("INFLUXDB_BUCKET"))

    if start and stop:
      query += '|> range(start: %s, stop: %s)' % (start, stop)
    elif start:
      query += '|> range(start: %s)' % (start)
    elif stop:
      query += '|> range(stop: %s)' % (stop)
    else:
      raise ValueError('Unbounded Query')

    query += '|> filter(fn: (r) => r._measurement == "sensors" and (r._field == "value"))'

    if group:
      query += '|> filter(fn: (r) => r.group == "%s")' % (group)

    if client:
      query += '|> filter(fn: (r) => r.client == "%s")' % (client)

    if sensor:
      query += '|> filter(fn: (r) => r.sensor == "%s")' % (sensor)

    if unit:
      query += '|> filter(fn: (r) => r.unit == "%s")' % (unit)

    if topic:
      query += '|> filter(fn: (r) => r.topic == "%s")' % (topic)

    results = self.query_api.query(query)
    table = results[0]
    print(table)
    for row in table.records:
      print(row.values)
