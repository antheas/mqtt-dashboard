export interface Sensor {
  group: string;
  client: string;
  sensor: string;
  unit: string;

  name: string;
  color?: string;
}

export interface Graph {
  id: string;
  name: string;
  type: "bump|heatmap|line|gauge";
  colors: string;

  min: number;
  max: number;
  span: number;

  sensors: Sensor[];
}

export interface Row {
  type: string;
}

export interface RowSingle extends Row {
  type: "single";
  graph: Graph;
}

export interface RowDouble extends Row {
  type: "double";
  split: "oox|oxx|ox";
  graph1: Graph;
  graph2: Graph;
}

export interface RowTriple extends Row {
  type: "triple";
  graph1: Graph;
  graph2: Graph;
  graph3: Graph;
}

export interface Dashboard {
  id: string;
  name: string;
  rows: Row[];

  streaming: boolean;
  span: number;
  time: number;
}
