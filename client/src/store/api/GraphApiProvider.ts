import { Graph } from "../types";
import React from "react";

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

export abstract class AbstractGraphApi {
  public abstract connect(
    graph: Graph,
    callback: (data: Series[]) => void
  ): void;
  public abstract disconnect(callback: (data: Series[]) => void): void;
}

class GraphApi extends AbstractGraphApi {
  public connect(graph: Graph, callback: (data: Series[]) => void): void {}
  public disconnect(callback: (data: Series[]) => void): void {}
}

const GraphApiContext = React.createContext(new GraphApi() as AbstractGraphApi);

export default GraphApiContext;
