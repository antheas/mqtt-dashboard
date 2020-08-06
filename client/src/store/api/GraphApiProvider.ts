import React from "react";
import {
  AbstractGraphApi,
  Graph,
  GraphData,
  TimescaleType,
  timescaleToMs,
} from "../types";
import axios from "axios";
import io from "socket.io-client";

export class GraphApi extends AbstractGraphApi {
  private graphs: Map<(data: GraphData) => void, Graph>;
  private cachedData: Map<(data: GraphData) => void, GraphData>;
  private sensorBindings: Map<
    string,
    { callback: (data: GraphData) => void; graph: Graph; i: number }[]
  >;

  private host: string;
  private streaming: boolean;
  private to?: Date;
  private scale?: TimescaleType;

  private interval: NodeJS.Timeout | undefined;
  private socket: SocketIOClient.Socket | undefined;

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
    this.sensorBindings = new Map();

    if (streaming) {
      this.socket = io(this.host);
      this.socket.on("sensor", (d: Record<string, string>) =>
        this.handleStream(d)
      );

      // Rebind on server restart
      this.socket.on("reconnect", () => {
        this.sensorBindings.forEach((data, topic) => {
          console.log(topic);
          this.socket?.emit("subscribe_sensor", {
            topic,
          });
        });
      });
    } else {
      this.interval = setInterval(this.refresh.bind(this), autoRefresh);
    }
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
              ? res.data.records.map((r: { x: number; y: number }) => ({
                  x: new Date(r.x),
                  y: r.y,
                }))
              : [],
          };

          callback({ ...data, series: [...data.series] });
        });
    });
  }

  public streamGraph(graph: Graph, callback: (data: GraphData) => void) {
    if (!this.streaming || !this.socket) return;

    graph.sensors.forEach((s, i) => {
      this.socket?.emit("subscribe_sensor", {
        topic: s.topic,
        group: s.group,
        client: s.client,
        sensor: s.sensor,
        unit: s.unit,
      });

      const topic = s.topic
        ? s.topic
        : `sensors/${s.group}/${s.client}/${s.sensor}/${s.unit}`;

      if (this.sensorBindings.has(topic)) {
        this.sensorBindings.get(topic)?.push({ callback, graph, i });
      } else {
        this.sensorBindings.set(topic, [{ callback, graph, i }]);
      }
    });
  }

  private handleStream(socketData: Record<string, string>) {
    const binds = this.sensorBindings.get(socketData.topic);
    if (!binds) return;

    binds.forEach((bind) => {
      const cache = this.cachedData.get(bind.callback);
      if (!cache) return;

      cache.series[bind.i].data.push({
        x: new Date(Math.floor(parseInt(socketData.x) * 1000)),
        y: socketData.y,
      });

      const scale = this.scale
        ? this.scale
        : bind.graph.scale
        ? bind.graph.scale
        : "15m";
      const to = this.to ? this.to : new Date();
      const from = new Date(to.getTime() - timescaleToMs(scale));

      bind.callback({ ...cache, series: [...cache.series], from, to });
    });
  }

  public connect(graph: Graph, callback: (data: GraphData) => void): void {
    this.refreshGraph(graph, callback);
    this.graphs.set(callback, graph);
    if (this.streaming) this.streamGraph(graph, callback);
  }
  public disconnect(callback: (data: GraphData) => void): void {
    this.graphs.delete(callback);
  }

  public destroy() {
    if (this.interval) clearInterval(this.interval);
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
