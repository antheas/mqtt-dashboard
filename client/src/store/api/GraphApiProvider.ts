import React from "react";
import { AbstractGraphApi, Graph, GraphData } from "../types";

class GraphApi extends AbstractGraphApi {
  public connect(graph: Graph, callback: (data: GraphData) => void): void {}
  public disconnect(callback: (data: GraphData) => void): void {}
}

const GraphApiContext = React.createContext(new GraphApi() as AbstractGraphApi);

export default GraphApiContext;
