import os
import signal
from datetime import datetime

from flask import Flask, request

from db import DatabaseManager
from flask_cors import CORS
from flask_mqtt import Mqtt
from flask_socketio import SocketIO, emit, join_room, leave_room
from stream import StreamManager

TIME_TAGS = ["start", "stop"]
TAGS = ["topic", "group", "client", "sensor", "unit"]


app = Flask(__name__)
app.config['MQTT_BROKER_URL'] = os.environ.get("BROKER_URL") or "broker"
app.config['MQTT_BROKER_PORT'] = 1883
app.config['MQTT_TLS_ENABLED'] = False
CORS(app)
db = DatabaseManager()
socketio = SocketIO(app)
mqtt = Mqtt(app)


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


@ app.route("/discovery")
def discovery():
  time = extract_headers(request.args, TIME_TAGS)
  tags = extract_headers(request.args, TAGS)

  assert (request.args)

  search = request.args["search"]

  assert(db.check_tags_valid(tags) and db.check_time_valid(
      time) and db.check_val_valid(search))

  return db.discovery(time, tags, search).toJSON()


@ app.errorhandler(Exception)
def handle_exception(e):
  return "(400)\nReason: Invalid Query\nMessage:<br/>\n%s" % (str(e)), 400


@mqtt.on_connect()
def on_connect(client, userdata, flags, rc):
  print("Connected with result code "+str(rc))
  mqtt.subscribe("sensors/#")


@mqtt.on_message()
def on_message(client, userdata, msg):
  sensor = msg.topic
  emit("sensor",
       {"x": datetime.timestamp(datetime.now()), "y": str(int(msg.payload))}, room=sensor)


@socketio.on('subscribe_sensor')
def subscribe_to_mqtt(data):
  if data.topic:
    join_room(data.topic)
  else:
    join_room("sensors/%s/%s/%s/%s" %
              (data.group, data.client, data.sensor, data.unit))


def signal_handler(sig, frame):
  socketio.stop()
  print('\b\bExiting...')


if __name__ == '__main__':
  print("Starting...")
  # signal.signal(signal.SIGINT, signal_handler)
  socketio.run(app, host='0.0.0.0')
