import os

import paho.mqtt.client as mqtt
from paho.mqtt import subscribe


class StreamManager:
  def __init__(self):
    self.client = mqtt.Client()

    self.client.on_connect = lambda client, userdata, flags, rc: self.on_connect(
        client, userdata, flags, rc)
    self.client.on_message = lambda client, userdata, msg: self.on_message(
        client, userdata, msg)
    self.client.connect(os.environ.get("BROKER_URL") or "broker", 1883, 60)
    self.client.loop_forever()

  def on_connect(self, client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    self.client.subscribe("sensors/#")

  def on_message(self, client, userdata, msg):
    print(msg.payload)
    raise Exception("Sorry, no numbers below zero")

  def disconnect(self):
    self.client.disconnect()
