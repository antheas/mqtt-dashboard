import json
import os
from json import JSONEncoder

from influxdb_client import InfluxDBClient


class QueryResult:
  def __init__(self, time, tags):
    self.time = time
    self.tags = tags

  def toDict(self):
    return self.__dict__

  def toJSON(self):
    return json.dumps(self.toDict())


class Series(QueryResult):
  records = []

  def toDict(self):
    return self.__dict__

  def addRecord(self, time, val):
    self.records.append({"x": str(time), "y": val})


class Discovery(QueryResult):
  values = []

  def __init__(self, time, tags, search):
    self.search = search
    super().__init__(time, tags)

  def toDict(self):
    return self.__dict__

  def addValue(self, values):
    self.values.append(values)


class DatabaseManager:

  def __init__(self):
    self.client = InfluxDBClient.from_env_properties()
    self.query_api = self.client.query_api()

  def create_base_query(self, time={"start": "-15m", "stop": "now()"}, tags={}):
    query = 'from(bucket: "%s")' % (os.environ.get("INFLUXDB_BUCKET"))

    # Bound for time
    if "start" in time:
      start = time["start"]
    if "stop" in time:
      stop = time["stop"]

    if start and stop:
      query += '|> range(start: %s, stop: %s)' % (start, stop)
    elif start:
      query += '|> range(start: %s)' % (start)
    elif stop:
      query += '|> range(stop: %s)' % (stop)
    else:
      raise ValueError('Unbounded Query')

    for tag, value in tags.items():
      query += '|> filter(fn: (r) => r.%s == "%s")' % (tag, value)

    return query

  def query(self, time, tags):
    results = self.query_api.query(self.create_base_query(time, tags))
    series = Series(time, tags)

    # Get results
    if not results:
      return series
    table = results[0]

    # Append and return
    for record in table.records:
      series.addRecord(record.get_time(), record.get_value())
    return series

  def discovery(self, time, tags, search):
    base = self.create_base_query(time, tags)
    query = base + \
        '|> group(columns:["%s"])|> distinct(column:"%s")|> group()' % (
            search, search)

    results = self.query_api.query(query)
    values = Discovery(time, tags, search)

    # Get results
    if not results:
      return values
    table = results[0]

    # Append and return
    for record in table.records:
      values.addValue(record.get_value())
    return values
