from flask import Flask
from db import DatabaseManager
app = Flask(__name__)
db = DatabaseManager()


@app.route("/")
def hello():
  return "Hello, World!"


@app.route("/query")
def query():
  return db.query("-1h", "now()", "", "temperature_sensor").toJSON()


@app.route("/discovery")
def discovery():
  return db.tag_values("group", sensor="poop")


# print(db.query("-1h", "now()", "", "temperature_sensor").toJSON())
app.run(host='0.0.0.0')
