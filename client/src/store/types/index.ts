export interface Sensor {
  group: string;
  client: string;
  sensor: string;
  unit: string;
}

export interface Graph {
  id: string;
  type: string;

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
  rows: Row;
}

export interface State {
  dashboards: Record<string, Dashboard>;
}
