import { DatumValue, LineSvgProps, ResponsiveLine } from "@nivo/line";
import { DataFormatter } from "@nivo/core";
import React, { useEffect, useState } from "react";
import {
  AbstractGraphApi,
  getGraphScale,
  Graph,
  GraphData,
  GraphWidth,
  NULL_GRAPH_DATA,
} from "../store/types";

// https://github.com/plouc/nivo/blob/master/packages/line/stories/line.stories.js

const BASE_STYLES: Partial<LineSvgProps> = {
  margin: { top: 25, right: 25, bottom: 50, left: 60 },
  colors: { scheme: "red_yellow_blue" },
  axisBottom: {
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
  legends: [
    {
      anchor: "bottom-right",
      direction: "column",
      justify: false,
      translateX: 100,
      translateY: 0,
      itemsSpacing: 0,
      itemDirection: "left-to-right",
      itemWidth: 80,
      itemHeight: 20,
      itemOpacity: 0.75,
      symbolSize: 12,
      symbolShape: "circle",
      symbolBorderColor: "rgba(0, 0, 0, .5)",
      effects: [
        {
          on: "hover",
          style: {
            itemBackground: "rgba(0, 0, 0, .03)",
            itemOpacity: 1,
          },
        },
      ],
    },
  ],
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

const getXFormatter = ({ scale }: Graph): DataFormatter => {
  return (t: DatumValue) =>
    t instanceof Date ? t.getMinutes() + ":" + t.getSeconds() : "";
};

const styleGraph = (graph: Graph, width: GraphWidth, data: GraphData) => {
  const styles: Partial<LineSvgProps> = {
    ...BASE_STYLES,
    xFormat: getXFormatter(graph),
    margin: {
      ...BASE_STYLES.margin,
      right: data.series.length > 1 ? 115 : 15,
    },
    axisLeft: {
      legend: graph.unit,
      legendOffset: 12,
    },
    axisBottom: {
      ...BASE_STYLES.axisBottom,
      format: getXFormatter(graph),
      tickValues: calculateTicks(width),
    },
    yScale: {
      type: "linear",
      min: graph.min ? graph.min : "auto",
      max: graph.max ? graph.max : "auto",
      stacked: false,
      reverse: false,
    },
    xScale: {
      type: "time",
      precision: "second",
      ...(data.from && { min: data.from }),
      ...(data.to && { max: data.to }),
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

  return (
    <ResponsiveLine data={data.series} {...styleGraph(graph, width, data)} />
  );
};

export default LineGraph;
