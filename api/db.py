import json
import os
import re
from datetime import datetime
from json import JSONEncoder

from influxdb_client import InfluxDBClient

TIME_TAG_RULE = re.compile("^(?:start|stop)$")
TIME_RULE = re.compile(
    "^(?:now\\(\\)|now\\(\\) ?[-+]? ?\\d+[mnudphs]|[-+]? ?\\d+[mhnudps]?)$")
TIMESTAMP_RULE = re.compile("^\\d+$")
TAG_RULE = re.compile("^[a-zA-Z][a-zA-Z\\d_]*$")
VAL_RULE = re.compile("^[\\da-zA-Z_]+$")
LIMIT = 5000


class QueryResult:
  def __init__(self, time, tags):
    self.time = time
    self.tags = tags

  def toDict(self):
    return self.__dict__

  def toJSON(self):
    return json.dumps(self.toDict())


class Series(QueryResult):
  def __init__(self, time, tags):
    self.records = []
    super().__init__(time, tags)

  def toDict(self):
    return self.__dict__

  def addRecord(self, time, val):
    self.records.append({"x": str(time), "y": val})


class Discovery(QueryResult):

  def __init__(self, time, tags, search):
    self.values = []
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

  def check_time_valid(self, time):
    for tag, value in time.items():
      if not (TIME_TAG_RULE.match(tag) and TIME_RULE.match(value)):
        return False
    return True

  def check_tags_valid(self, tags):
    for tag, value in tags.items():
      if not (TAG_RULE.match(tag) and VAL_RULE.match(value)):
        return False
    return True

  def check_val_valid(self, value):
    return VAL_RULE.match(value)

  def create_base_query(self, time={"start": "-15m", "stop": "now()"}, tags={}):
    query = 'from(bucket: "%s")' % (os.environ.get("INFLUXDB_BUCKET"))

    # Bound for time
    start = stop = ''
    if "start" in time:
      start = time["start"]
      if TIMESTAMP_RULE.match(start):
        start = datetime.fromtimestamp(int(start) / 1000).isoformat()
        print(start)
    if "stop" in time:
      stop = time["stop"]
      if TIMESTAMP_RULE.match(stop):
        stop = datetime.fromtimestamp(int(stop) / 1000).isoformat()
        print(stop)

    if start and stop:
      query += '|> range(start: %s, stop: %s)' % (start, stop)
    elif start:
      query += '|> range(start: %s)' % (start)
    # elif stop:
    #   query += '|> range(stop: %s)' % (stop)
    else:
      raise ValueError('Unbounded Query (missing start)')

    for tag, value in tags.items():
      query += '|> filter(fn: (r) => r.%s == "%s")' % (tag, value)

    return query

  def query(self, time, tags):
    query = self.create_base_query(time, tags) + "|> limit(n: %d)" % (LIMIT)
    results = self.query_api.query(query)
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
