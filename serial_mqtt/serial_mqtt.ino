// This example uses an ESP32 Development Board
// to connect to shiftr.io.
//
// You can check on your device after a successful
// connection here: https://shiftr.io/try.
//
// by Joël Gähwiler
// https://github.com/256dpi/arduino-mqtt

#include <WiFi.h>
#include <MQTT.h>

const char ssid[] = "TRP";
const char pass[] = "<removed>";

const char broker[] = "192.168.1.4";
const int port = 1883;

const char username[] = "";
const char password[] = "";
const char id[] = "trpesp-12341234";

#define LED_BUILTIN 2

WiFiClient net;
MQTTClient client(1024);

unsigned long lastMillis = 0;

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

  client.subscribe("/led");
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
    client.publish("/hall", buff);
  }
}
