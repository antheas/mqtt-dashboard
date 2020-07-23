import json
import os
from json import JSONEncoder

from influxdb_client import InfluxDBClient


class Series:

  def __init__(self, start, stop, topic, group, client, sensor, unit):
    self.params = {
        "start": start,
        "stop": stop,
        "topic": topic,
        "group": group,
        "client": client,
        "sensor": sensor,
        "unit": unit
    }
    self.records = []

  def addRecord(self, time, val):
    self.records.append({"x": str(time), "y": val})

  def toJSON(self):
    return json.dumps({
        "params": self.params,
        "records": self.records
    }, indent=4)


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

    series = Series(start, stop, topic, group, client, sensor, unit)
    for record in table.records:
      series.addRecord(record.get_time(), record.get_value())
    return series
