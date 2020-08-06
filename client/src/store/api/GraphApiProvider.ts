import React from "react";
import {
  AbstractGraphApi,
  Graph,
  GraphData,
  TimescaleType,
  timescaleToMs,
} from "../types";
import axios from "axios";

export class GraphApi extends AbstractGraphApi {
  private graphs: Map<(data: GraphData) => void, Graph>;
  private cachedData: Map<(data: GraphData) => void, GraphData>;

  private host: string;
  private streaming: boolean;
  private to?: Date;
  private scale?: TimescaleType;

  private interval: NodeJS.Timeout;

  constructor(
    host: string,
    autoRefresh: number,
    streaming: boolean,
    to?: Date,
    scale?: TimescaleType
  ) {
    super();

    this.host = host;
    this.streaming = streaming;
    this.to = to;
    this.scale = scale;

    this.graphs = new Map();
    this.cachedData = new Map();

    this.interval = setInterval(this.refresh.bind(this), autoRefresh);
  }

  private refresh() {
    this.graphs.forEach((g, c) => this.refreshGraph(g, c));
  }

  public refreshGraph(g: Graph, callback: (data: GraphData) => void) {
    // Define timespans
    const scale = this.scale ? this.scale : g.scale ? g.scale : "15m";
    const to = this.to ? this.to : new Date();
    const from = new Date(to.getTime() - timescaleToMs(scale));

    const cache = this.cachedData.get(callback)?.series;
    const data: GraphData = {
      from,
      to,
      scale,
      series: cache
        ? cache
        : g.sensors.map((p) => ({
            id: p.name,
            data: [],
          })),
    };
    this.cachedData.set(callback, data);

    // Make get request for each sensor
    g.sensors.forEach((s, i) => {
      axios
        .get(`${this.host}/query`, {
          params: {
            group: s.group,
            client: s.client,
            sensor: s.sensor,
            unit: s.unit,
            topic: s.topic,
            start: Math.floor(from.getTime() / 1000),
            stop: Math.floor(to.getTime() / 1000),
          },
        })
        .then((res) => {
          data.series[i] = {
            id: s.name,
            data: res.data.records
              ? res.data.records.map((r) => ({
                  x: new Date(r.x),
                  y: r.y,
                }))
              : [],
          };

          callback({ ...data });
        });
    });
  }

  public connect(graph: Graph, callback: (data: GraphData) => void): void {
    this.refreshGraph(graph, callback);
    this.graphs.set(callback, graph);
  }
  public disconnect(callback: (data: GraphData) => void): void {
    this.graphs.delete(callback);
  }

  public destroy() {
    clearInterval(this.interval);
  }
}

export class StubGraphApi extends AbstractGraphApi {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public connect(): void {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public disconnect(): void {}
}

const GraphApiContext = React.createContext(
  new StubGraphApi() as AbstractGraphApi
);

export default GraphApiContext;
