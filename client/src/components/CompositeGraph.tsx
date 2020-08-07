import React from "react";
import GraphApiContext from "../store/api/GraphApiProvider";
import { Graph, GraphWidth } from "../store/types";
import LineGraph from "./LinearGraph";
import TableGraph from "./TableGraph";

const CompositeGraph = ({
  graph: g,
  width,
}: {
  graph: Graph;
  width: GraphWidth;
}) => {
  let className = "graph--third";
  switch (width) {
    case "full":
      className = "graph--full";
      break;
    case "half":
      className = "graph--half";
      break;
    case "third":
      className = "graph--third";
      break;
    case "two-thirds":
      className = "graph--two-thirds";
      break;
  }

  const type = g.type;

  if (g) {
    return (
      <div className={`graph graph--empty ${className}`}>
        <div className="graph__header">{g.name} </div>
        <GraphApiContext.Consumer>
          {(api) => (
            <>
              {type === "line" && (
                <LineGraph graph={g} api={api} width={width} />
              )}
              {type === "table" && (
                <TableGraph graph={g} api={api} width={width} />
              )}
            </>
          )}
        </GraphApiContext.Consumer>
      </div>
    );
  } else {
    return <div className={`graph graph--empty ${className}`} />;
  }
};

export default CompositeGraph;
