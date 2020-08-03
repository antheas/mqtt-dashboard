import React from "react";
import { AbstractGraphApi, Graph, GraphData } from "../types";
import axios from "axios";

class GraphApi extends AbstractGraphApi {
  private graphs: Map<(data: GraphData) => void, Graph> = new Map();
  private cachedData: Map<(data: GraphData) => void, GraphData> = new Map();

  private host: string;
  private streaming: boolean;
  private timespan?: number;
  private to?: number;

  private interval: NodeJS.Timeout;

  constructor(
    host: string,
    autoRefresh: number,
    streaming: boolean,
    to?: number,
    timespan?: number
  ) {
    super();

    this.host = host;
    this.streaming = streaming;
    this.to = to;
    this.timespan = timespan;

    this.interval = setInterval(this.refresh, autoRefresh);
  }

  private refresh() {
    this.graphs.forEach((g, callback) => {
      const data: GraphData = this.cachedData.get(callback) || {
        to: this.to ? this.to : new Date().getTime(),
        timespan: this.timespan && this.timespan,
        series: [],
      };

      if (!this.to) {
        data.to = new Date().getTime();
      }

      // Define timespans
      let timeStart = 0;
      let timeStop = 0;
      if (this.timespan && this.to) {
        timeStart = this.to - this.timespan;
        timeStop = this.to;
      } else if (this.timespan) {
        timeStart = new Date().getTime() - this.timespan;
        timeStop = new Date().getTime();
      } else if (this.to) {
        timeStart = this.to - g.span;
        timeStop = this.to;
      } else {
        timeStart = new Date().getTime() - g.span;
        timeStop = new Date().getTime();
      }

      // Make get request for each sensor
      g.sensors.forEach(async (s) => {
        const res = await axios.get(`${this.host}/query`, {
          params: {
            group: s.group,
            client: s.client,
            sensor: s.sensor,
            unit: s.unit,
            topic: s.topic,
            start: timeStart,
            stop: timeStop,
          },
        });

        data.series.push({
          id: s.name,
          data: JSON.parse(res.data).records,
        });

        this.cachedData.set(callback, data);
        callback(data);
      });
    });
  }

  public connect(graph: Graph, callback: (data: GraphData) => void): void {
    this.graphs.set(callback, graph);
  }
  public disconnect(callback: (data: GraphData) => void): void {
    this.graphs.delete(callback);
  }

  public destroy() {
    clearInterval(this.interval);
  }
}

class StubGraphApi extends AbstractGraphApi {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public connect(): void {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public disconnect(): void {}
}

const GraphApiContext = React.createContext(
  new StubGraphApi() as AbstractGraphApi
);

export default GraphApiContext;
