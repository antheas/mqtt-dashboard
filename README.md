# MQTT Proof of Concept
Run a sample docker using `docker run -it -p 1883:1883 -p 9001:9001 eclipse-mosquitto`.
Flash firmware in serial_mqtt using a proper wifi password.
The ESP32 connects to the broker and starts publishing hall sensor 
measurements 4 times per second in `/hall`.
It also subscribes to the LED topic. 
By publishing a value to the `/led` topic the built in led can be controlled.

## Connecting to the broker with a device
MQTT Explorer and MQTT Dash (android) can connect to the broker and control the ESP
while recording the hall effect sensor values.

## Python Client
The file python-client.py implements a MQTT client using using Eclipse Paho and writes
the hall measurements in a file called out.txt.
Also, if the values exceed a threshold it publishes to the /led topic turning on the ESP led.