# MQTT Persistent Dashboard with React and InfluxDB 
A concept project for monitoring and injesting data from MQTT sensors.
This concept was created to test the viability of combining MQTT, react, and the InfluxDB
database to persist and display sensor data with streaming support.
Due to time constraints, only a prototype was built, missing key features, such as a
timeline with playback, customisable timeframes, a dashboard builder, alerts, configuration
storage etc.
However, if you so desire, with minimal modifications you could create your own custom dashboard
and display your own sensor data (even though the builder hasn't been created).

## Description
In the heart of this project lies the Eclipse Mosquitto broker.
The user can connect multiple MQTT sensors to that broker by supplying them
its credentials.
Then, provided the sensors use a specific publishing format (`sensors/$group/$client/$sensor/$unit`)
their data will be timestamped and saved automatically to a InfluxDB instance.
This requires no configuration by the user, sensors are completely plug and play.
A lightweight python api connects to both InfluxDB and the Broker and provides the frontend
with access to historical data and a websocket subscription for streaming directly from the MQTT
broker.

With a special `/discovery` endpoint, the frontend can ask the backend for sensors which
have been recorded lately.
Then, in the (future) builder the user can pick a sensor without knowing its exact publishing
endpoint.
Also, since with each point we store its `group`, `client`, `sensor`, and `unit` type we can average
the data for any of these tags.
For example, if the `group` refers to a room in a factory, and we pin `sensor` to temperature, by averaging the `client`, we could find the average temperature of the room.
Storing separate tags for the data doesn't increase cardinality or storage consumption since
they are only stored once for each time series by the InfluxDB.

### Tech Stack
The frontend is a React app with a redux model for its configuration.
For websockets the socket.io protocol is used.
To ingest and persist data from the broker, InfluxData's telegraf is used.
This could be changed in the future.
For user convenience, the docker-compose file contains a Cronograf instance
to test out queries.
To build the frontend files, webpack is used with a node container
which will build and watch the files on startup.
To host the files and provide reverse proxying for the api an NGINX instance is used.

## How to use
In its current state, the project features a proper docker-compose file which sets up, builds 
the project and opens up the proper ports.
Launch and build the project by running `docker-compose up -d --build`.
After the Gateway 500 error goes away the project is built and ready to use.

### Sensors
To use, configure your sensors to connect to your WIFI and broker and publish to
`sensors/$group/$client/$sensor/$value`, where:
 - group: refers to a grouping of publishing devices (ex. ESP32s) by room, place, equipment or area.
 - client: identifies a device that broadcasts in the group (ex. one of the ESP32s)
 - sensor: since devices can have multiple sensors, this endpoint identifies the sensor (ex. temp1)
 - unit: sensors may have multiple values as well (such as humidity and temperature),
   so you can specify a different one, or just set to value.

If you are unsure for what firmware or sensors to use, checkout ESPEasy for ESP32 and ESP8266
boards, which will be simple to configure to output to this format.
If you want something simpler and less configurable, the folder `sensor/` contains an Arduino
sketch which will publish an ESP32's built in temp sensor and hall data to the broker.

### Dashboard
The dashboard is an early prototype.
To create your own custom dashboards you can modify the `client/store/test.ts` file
with your own dashboards.
Currently, it has the one that is shown above.