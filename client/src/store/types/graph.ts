import { Graph } from "./dashboard";

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
  timespan: number;
  to: number;
  series: Series[];
}

export const NULL_GRAPH_DATA: GraphData = {
  timespan: -1,
  to: -1,
  series: [],
};

export abstract class AbstractGraphApi {
  public abstract connect(
    graph: Graph,
    callback: (data: GraphData) => void
  ): void;
  public abstract disconnect(callback: (data: GraphData) => void): void;
}
