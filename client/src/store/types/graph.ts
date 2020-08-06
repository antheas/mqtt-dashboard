export type TimescaleType = string;

export type GraphScale =
  | "1m"
  | "5m"
  | "15m"
  | "30m"
  | "1h"
  | "6h"
  | "1d"
  | "1w"
  | "1o"
  | "6o"
  | "1y"
  | "all";

export type GraphWidth = "third" | "half" | "two-thirds" | "full";

export function timescaleToMs(scale: TimescaleType): number {
  switch (scale) {
    case "1m":
      return 60 * 1000;
    case "5m":
      return 5 * 60 * 1000;
    case "15m":
      return 15 * 60 * 1000;
    case "30m":
      return 30 * 60 * 1000;
    case "1h":
      return 1 * 3600 * 1000;
    case "6h":
      return 6 * 3600 * 1000;
    case "1d":
      return 24 * 3600 * 1000;
    case "1w":
      return 7 * 24 * 3600 * 1000;
    case "1o":
      return 30 * 24 * 3600 * 1000;
    case "6o":
      return 180 * 24 * 3600 * 1000;
    case "1y":
      return 365 * 24 * 3600 * 1000;
    case "all":
    // fallthrough
    default:
      return 5 * 365 * 24 * 3600 * 1000;
  }
}

export function getGraphScale(scale: TimescaleType): GraphScale {
  return scale as GraphScale;
}

export type DatumValue = string | number | Date;

export interface Datum {
  x?: DatumValue | null;
  y?: DatumValue | null;
  [key: string]: any;
}

export interface Series {
  id: string | number;
  data: Datum[];
  [key: string]: any;
}

export interface GraphData {
  scale?: TimescaleType;
  to: Date | null;
  from: Date | null;
  series: Series[];
}

export const NULL_GRAPH_DATA: GraphData = {
  scale: "15m",
  to: null,
  from: null,
  series: [],
};

export abstract class AbstractGraphApi {
  public abstract connect(
    graph: Graph,
    callback: (data: GraphData) => void
  ): void;
  public abstract disconnect(callback: (data: GraphData) => void): void;
}

export interface Sensor {
  group?: string;
  client?: string;
  sensor?: string;
  unit?: string;
  topic?: string;

  name: string;
  color?: string;
}

export interface Graph {
  id: string;
  name: string;
  type: "bump" | "heatmap" | "line" | "gauge";
  colors?: string;

  min?: number;
  max?: number;
  scale: TimescaleType;
  unit: string;

  sensors: Sensor[];
}
