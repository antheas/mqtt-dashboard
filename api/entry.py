from flask import Flask
from db import DatabaseManager
app = Flask(__name__)
db = DatabaseManager()


@app.route("/")
def hello():
  return "Hello, World!"


@app.route("/query")
def query():
  return db.query(time={"start": "-1h", "stop": "now()"}, tags={
      # "topic": "",
      # "group": "",
      # "client": "",
      # "sensor": "temp",
      # "unit": ""
  }).toJSON()


@app.route("/discovery")
def discovery():
  return db.discovery(time={"start": "-1h", "stop": "now()"}, tags={
      # "topic": "",
      # "group": "",
      # "client": "",
      # "sensor": "",
      # "unit": ""
  }, search="sensor").toJSON()


# print(db.query("-1h", "now()", "", "temperature_sensor").toJSON())
app.run(host='0.0.0.0')
