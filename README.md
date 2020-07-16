# MQTT Proof of Concept
Run a sample docker using `docker run -it -p 1883:1883 -p 9001:9001 eclipse-mosquitto`.
Flash firmware in serial_mqtt using a proper wifi password.
The ESP32 connects to the broker and starts publishing hall sensor 
measurements 4 times per second in `/hall`.
It also subscribes to the LED topic. 
By publishing a value to the `/led` topic the built in led can be controlled.