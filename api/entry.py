from flask import Flask, request

from db import DatabaseManager

TIME_TAGS = ["start", "stop"]
TAGS = ["topic", "group", "client", "sensor", "unit"]


app = Flask(__name__)
db = DatabaseManager()


def extract_headers(args, tags):
  res = {}
  for tag in tags:
    if tag in args:
      res[tag] = args[tag]

  return res


@app.route("/query")
def query():
  time = extract_headers(request.args, TIME_TAGS)
  tags = extract_headers(request.args, TAGS)

  assert(db.check_tags_valid(tags) and db.check_time_valid(time))

  return db.query(time, tags).toJSON()


@app.route("/discovery")
def discovery():
  time = extract_headers(request.args, TIME_TAGS)
  tags = extract_headers(request.args, TAGS)

  assert (request.args)

  search = request.args["search"]

  assert(db.check_tags_valid(tags) and db.check_time_valid(
      time) and db.check_val_valid(search))

  return db.discovery(time, tags, search).toJSON()


@app.errorhandler(Exception)
def handle_exception(e):
  return "(400)\nReason: Invalid Query\nMessage:<br/>\n%s" % (str(e)), 400


app.run(host='0.0.0.0')
