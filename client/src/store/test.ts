import { updateHost, updateDashboards } from "./actions";
import { RowDouble, RowSingle } from "./types";

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
            split: "oox",
            graph1: {
              id: "5",
              type: "line",
              name: "Grind Wheel",
              scale: "15m",
              unit: "C",
              sensors: [
                {
                  name: "Temp Sensor",
                  group: "temperature_sensor",
                  client: "0",
                  sensor: "temp",
                  unit: "temperature",
                },
                // {
                //   name: "Hall Sensor",
                //   group: "esp_sensor",
                //   client: "1",
                //   sensor: "temp",
                //   unit: "celcius",
                // },
                // {
                //   name: "Hall Sensor",
                //   group: "esp_sensor",
                //   client: "1",
                //   sensor: "hall",
                //   unit: "magnetic_field",
                // },
              ],
            },
            graph2: {
              id: "5",
              type: "line",
              name: "Grind Wheel",
              scale: "1m",
              unit: "C",
              // min: 20,
              // max: 80,
              sensors: [
                {
                  name: "Temp Sensor",
                  group: "temperature_sensor",
                  client: "0",
                  sensor: "temp",
                  unit: "temperature",
                },
                // {
                //   name: "ESP",
                //   group: "esp_sensor",
                //   client: "1",
                //   sensor: "temp",
                //   unit: "celcius",
                // },
                // {
                //   name: "Hall Sensor",
                //   group: "esp_sensor",
                //   client: "1",
                //   sensor: "hall",
                //   unit: "magnetic_field",
                // },
              ],
            },
          } as RowDouble,
          {
            type: "double",
            split: "oxx",
            graph2: {
              id: "5",
              type: "line",
              name: "Grind Wheel",
              scale: "15m",
              unit: "C",
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
            graph1: {
              id: "5",
              type: "line",
              name: "Grind Wheel",
              scale: "1m",
              unit: "C",
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
          } as RowDouble,
          {
            type: "single",
            graph: {
              id: "8",
              type: "line",
              name: "Long",
              scale: "30m",
              unit: "C",
              sensors: [
                {
                  name: "Temp Sensor",
                  group: "temperature_sensor",
                  client: "0",
                  sensor: "temp",
                  unit: "temperature",
                },
                // {
                //   name: "ESP",
                //   group: "esp_sensor",
                //   client: "1",
                //   sensor: "temp",
                //   unit: "celcius",
                // },
                // {
                //   name: "Hall Sensor",
                //   group: "esp_sensor",
                //   client: "1",
                //   sensor: "hall",
                //   unit: "magnetic_field",
                // },
              ],
            },
          } as RowSingle,
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
