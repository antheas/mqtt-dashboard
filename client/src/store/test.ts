import { updateHost, updateDashboards } from "./actions";
import { RowDouble, RowSingle, RowTriple } from "./types";

export default function fillTestData(dispatch: (action: any) => void) {
  dispatch(updateHost("sensors.lan"));
  dispatch(
    updateDashboards({
      "1": {
        id: "1",
        name: "Warehouse Sensors",
        rows: [
          {
            type: "double",
            split: "ox",
            graph1: {
              id: "5",
              type: "line",
              name: "Temp Sensor (15m)",
              scale: "15m",
              unit: "Celcius",
              sensors: [
                {
                  name: "Temp Sensor",
                  group: "temperature_sensor",
                  client: "0",
                  sensor: "temp",
                  unit: "temperature",
                },
              ],
            },
            graph2: {
              id: "5",
              type: "line",
              name: "Hall Sensor (5m)",
              scale: "5m",
              unit: "Tesla",
              sensors: [
                {
                  name: "ESP Hall",
                  group: "esp_sensor",
                  client: "1",
                  sensor: "hall",
                  unit: "magnetic_field",
                },
              ],
            },
          } as RowDouble,
          {
            type: "triple",
            split: "ox",
            graph1: {
              id: "5",
              type: "line",
              name: "ESP32 Hall Stream",
              scale: "1m",
              unit: "Tesla",
              // min: 20,
              // max: 80,
              sensors: [
                {
                  name: "ESP Hall",
                  group: "esp_sensor",
                  client: "1",
                  sensor: "hall",
                  unit: "magnetic_field",
                },
              ],
            },
            graph2: {
              id: "7",
              type: "line",
              name: "ESP32 Temp Stream",
              scale: "1m",
              unit: "Tesla",
              min: 45,
              max: 60,
              sensors: [
                {
                  name: "ESP Hall",
                  group: "esp_sensor",
                  client: "1",
                  sensor: "temp",
                  unit: "celcius",
                },
              ],
            },
            graph3: {
              id: "9",
              type: "table",
              name: "Temp Sensor Table",
              scale: "1m",
              min: 30,
              max: 60,
              unit: "C",
              sensors: [
                {
                  name: "ESP8266 Temp",
                  group: "temperature_sensor",
                  client: "0",
                  sensor: "temp",
                  unit: "temperature",
                },
                {
                  name: "ESP32 Temp",
                  group: "esp_sensor",
                  client: "1",
                  sensor: "temp",
                  unit: "celcius",
                },
              ],
            },
          } as RowTriple,
          {
            type: "double",
            split: "oox",
            graph1: {
              id: "8",
              type: "line",
              name: "Both Temp Sensors (30m)",
              scale: "30m",
              min: 30,
              max: 60,
              unit: "C",
              sensors: [
                {
                  name: "ESP8266 Temp",
                  group: "temperature_sensor",
                  client: "0",
                  sensor: "temp",
                  unit: "temperature",
                },
                {
                  name: "ESP32 Temp",
                  group: "esp_sensor",
                  client: "1",
                  sensor: "temp",
                  unit: "celcius",
                },
              ],
            },
            graph2: {
              id: "9",
              type: "table",
              name: "Temp Sensor Table",
              scale: "1m",
              min: 30,
              max: 60,
              unit: "C",
              sensors: [
                {
                  name: "ESP8266 Temp",
                  group: "temperature_sensor",
                  client: "0",
                  sensor: "temp",
                  unit: "temperature",
                },
                {
                  name: "ESP32 Temp",
                  group: "esp_sensor",
                  client: "1",
                  sensor: "temp",
                  unit: "celcius",
                },
              ],
            },
          } as RowDouble,
        ],
        span: 1000000,
        streaming: true,
        time: 0,
      },
      "2": {
        id: "2",
        name: "Weather Channel",
        rows: [],
        span: 100000,
        streaming: true,
        time: 0,
      },
      "3": {
        id: "3",
        name: "Upper Deck",
        rows: [],
        span: 100000,
        streaming: true,
        time: 0,
      },
      "4": {
        id: "4",
        name: "Mill",
        rows: [],
        span: 100000,
        streaming: true,
        time: 0,
      },
    })
  );
}
