import { updateHost, updateDashboards } from "./actions";

export default function fillTestData(dispatch: (action: any) => void) {
  dispatch(updateHost("sensors.lan"));
  dispatch(
    updateDashboards({
      "1": {
        id: "1",
        name: "Warehouse Sensors",
        rows: [],
        span: 100000,
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
