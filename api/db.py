import json
import os
from json import JSONEncoder

from influxdb_client import InfluxDBClient


class QueryResult:
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

  def toDict(self):
    return self.__dict__

  def toJSON(self):
    return json.dumps(self.toDict())


class Series(QueryResult):
  records = []

  def toDict(self):
    return {"params": self.params, "records": self.records}

  def addRecord(self, time, val):
    self.records.append({"x": str(time), "y": val})


class Discovery(QueryResult):
  tags = []

  def toDict(self):
    return {"params": self.params, "tags": self.tags}

  def addValue(self, values):
    self.tags.append(values)


class DatabaseManager:

  def __init__(self):
    self.client = InfluxDBClient.from_env_properties()
    self.query_api = self.client.query_api()

  def create_base_query(self, start="-15m", stop="now()", topic="", group="", client="", sensor="", unit=""):
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

    return query

  def query(self, start="-15m", stop="now()", topic="", group="", client="", sensor="", unit=""):
    results = self.query_api.query(self.create_base_query(
        start, stop, topic, group, client, sensor, unit))
    table = results[0]

    series = Series(start, stop, topic, group, client, sensor, unit)
    for record in table.records:
      series.addRecord(record.get_time(), record.get_value())
    return series

  def tag_values(self, tag, start="-24h", stop="now()", topic="", group="", client="", sensor="", unit=""):
    base = self.create_base_query(
        start, stop, topic, group, client, sensor, unit)
    query = base + \
        '|> group(columns:["%s"])|> distinct(column:"%s")|> group()' % (
            tag, tag)
    print(query)
    results = self.query_api.query(query)
    tags = Discovery(start, stop, topic, group, client, sensor, unit)

    if not results:
      return tags.toJSON()
    table = results[0]
    for record in table.records:
      tags.addValue(record.get_value())
    return tags.toJSON()
