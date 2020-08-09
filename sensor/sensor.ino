// Simple MQTT Esp example taken from the esp library
// The sensor will connect to the wifi and broker provided and do the following:
// Publish its hall measurements to sensors/esp_sensor/1/hall/magnetic_field at 4Hz
// Publish its temp measurements to sensors/esp_sensor/1/temp/celcius at 4Hz
// Listen to actuators/esp_sensor/1/led/value and control its led with the value.

// To use install the arduino ESP boards and the MQTT library
// https://github.com/esp8266/Arduino
// https://github.com/256dpi/arduino-mqtt

// Example based on:
// https://github.com/256dpi/arduino-mqtt/blob/master/examples/ESP32DevelopmentBoard/ESP32DevelopmentBoard.ino

#include <WiFi.h>
#include <MQTT.h>

const char ssid[] = "YourWifi";
const char pass[] = "YourWifisPassword";

const char broker[] = "192.168.1.123";
const int port = 1883;

// Broker credentials
const char username[] = "";
const char password[] = "";
const char id[] = "esp-12341234";

#define LED_BUILTIN 2

WiFiClient net;
MQTTClient client(1024);

unsigned long lastMillis = 0;

#ifdef __cplusplus
extern "C"
{
#endif
  uint8_t temprature_sens_read();
#ifdef __cplusplus
}
#endif

void connect()
{
  Serial.print("checking wifi...");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(1000);
  }

  Serial.print("\nconnecting...");
  while (!client.connect(id, username, password, false))
  {
    Serial.print(".");
    delay(1000);
  }

  Serial.println("\nconnected!");

  client.subscribe("actuators/esp_sensor/1/led/value");
  // client.unsubscribe("/hello");

  // initialize digital pin LED_BUILTIN as an output.
  pinMode(LED_BUILTIN, OUTPUT);
}

void messageReceived(String &topic, String &payload)
{
  Serial.println("incoming: " + topic + " - " + payload);
  if (topic != "/led")
    return;
  digitalWrite(LED_BUILTIN, payload == "1");

  // Note: Do not use the client in the callback to publish, subscribe or
  // unsubscribe as it may cause deadlocks when other things arrive while
  // sending and receiving acknowledgments. Instead, change a global variable,
  // or push to a queue and handle it in the loop after calling `client.loop()`.
}

void setup()
{
  Serial.begin(115200);
  WiFi.begin(ssid, pass);

  // Note: Local domain names (e.g. "Computer.local" on OSX) are not supported
  // by Arduino. You need to set the IP address directly.
  //
  // MQTT brokers usually use port 8883 for secure connections.
  client.begin(broker, port, net);
  client.onMessage(messageReceived);

  connect();
}

void loop()
{
  client.loop();
  delay(10); // <- fixes some issues with WiFi stability

  // publish a message roughly every second.
  if (millis() - lastMillis > 250)
  {
    if (!client.connected())
    {
      Serial.print("lastError: ");
      Serial.println(client.lastError());
      connect();
    }
    lastMillis = millis();

    char buff[50];
    sprintf(buff, "%d", hallRead());
    client.publish("sensors/esp_sensor/1/hall/magnetic_field", buff);

    sprintf(buff, "%.3f", (temprature_sens_read() - 32) / 1.8);
    client.publish("sensors/esp_sensor/1/temp/celcius", buff);
  }
}
