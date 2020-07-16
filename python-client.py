import paho.mqtt.client as mqtt
import signal

f = open("out.txt", "w+")
led = 0


def on_connect(client, userdata, flags, rc):
  print("Connected with result code "+str(rc))

  # Subscribing in on_connect() means that if we lose the connection and
  # reconnect then subscriptions will be renewed.
  client.subscribe("/hall")


def on_message(client, userdata, msg):
  global led
  print(msg.topic+" "+str(msg.payload))
  if msg.topic != "/hall":
    return

  hall = int(msg.payload)
  if hall > 43 and led == 0:
    led = 1
    client.publish("/led", 1)
    print("turning on led...")
  elif hall <= 43 and led == 1:
    led = 0
    client.publish("/led", 0)
    print("turning off led...")

  f.write("%d\r\n" % (hall))


def signal_handler(sig, frame):
  print('Exitting...')
  client.disconnect()


signal.signal(signal.SIGINT, signal_handler)

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect("localhost", 1883, 60)

# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.
client.loop_forever()
f.close()
