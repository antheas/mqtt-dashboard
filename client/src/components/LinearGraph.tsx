import React, { useState, useEffect } from "react";
import {
  Graph,
  GraphData,
  AbstractGraphApi,
  NULL_GRAPH_DATA,
  TimescaleType,
  getGraphScale,
  GraphWidth,
} from "../store/types";
import { ResponsiveLine, DatumValue, LineSvgProps } from "@nivo/line";

// https://github.com/plouc/nivo/blob/master/packages/line/stories/line.stories.js

const BASE_STYLES: Partial<LineSvgProps> = {
  margin: { top: 0, right: 0, bottom: 50, left: 60 },
  xScale: {
    type: "time",
    precision: "second",
  },
  xFormat: (t: DatumValue) =>
    t instanceof Date ? t.getMinutes() + ":" + t.getSeconds() : "",
  yScale: {
    type: "linear",
    min: "auto",
    max: "auto",
    stacked: true,
    reverse: false,
  },
  colors: { scheme: "red_yellow_blue" },
  axisBottom: {
    format: (t: DatumValue) =>
      t instanceof Date ? t.getMinutes() + ":" + t.getSeconds() : "aa",
    tickValues: 6,
    legend: "t(s)",
    legendOffset: -12,
  },
  curve: "monotoneX",
  animate: false,
  pointSize: 16,
  pointBorderWidth: 1,
  pointBorderColor: {
    from: "color",
    modifiers: [["darker", 0.3]],
  },
  useMesh: true,
  enableSlices: false,
  enablePoints: false,
};

const calculateTicks = (width: GraphWidth) => {
  switch (width) {
    case "full":
      return 15;
    case "half":
      return 10;
    case "third":
      return 5;
    case "two-thirds":
      return 8;
    default:
      return 10;
  }
};

const styleGraph = (graph: Graph, width: GraphWidth) => {
  const styles = {
    ...BASE_STYLES,
    axisLeft: {
      legend: graph.unit,
      legendOffset: 12,
    },
    axisBottom: {
      ...BASE_STYLES.axisBottom,
      tickValues: calculateTicks(width),
    },
  };
  switch (getGraphScale(graph.scale)) {
    case "1m":
    default:
      return styles;
  }
};

const LineGraph = ({
  graph,
  width,
  api,
}: {
  graph: Graph;
  width: GraphWidth;
  api: AbstractGraphApi;
}) => {
  const [data, setData] = useState(NULL_GRAPH_DATA);

  useEffect(() => {
    const callback = (data: GraphData) => setData(data);
    api.connect(graph, callback);
    return () => {
      api.disconnect(callback);
    };
  }, [graph, api]);

  return <ResponsiveLine data={data.series} {...styleGraph(graph, width)} />;
};

export default LineGraph;
