import React from "react";
import GraphApiContext from "../store/api/GraphApiProvider";
import { Graph } from "../store/types";
import LineGraph from "./LinearGraph";

const CompositeGraph = ({
  graph: g,
  className,
}: {
  graph: Graph;
  className: string;
}) => {
  if (g) {
    return (
      <div className={`graph graph--empty ${className}`}>
        <GraphApiContext.Consumer>
          {(api) => <LineGraph graph={g} api={api} />}
        </GraphApiContext.Consumer>
      </div>
    );
  } else {
    return <div className={`graph graph--empty ${className}`} />;
  }
};

export default CompositeGraph;
