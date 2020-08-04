import React, { useState, useEffect } from "react";
import {
  Graph,
  GraphData,
  AbstractGraphApi,
  NULL_GRAPH_DATA,
} from "../store/types";
import { ResponsiveLine, DatumValue } from "@nivo/line";

// https://github.com/plouc/nivo/blob/master/packages/line/stories/line.stories.js

const LineGraph = ({ graph, api }: { graph: Graph; api: AbstractGraphApi }) => {
  const [data, setData] = useState(NULL_GRAPH_DATA);

  useEffect(() => {
    const callback = (data: GraphData) => setData(data);
    api.connect(graph, callback);
    return () => {
      api.disconnect(callback);
    };
  }, [graph, api]);

  return (
    <ResponsiveLine
      data={data.series}
      // margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{
        type: "time",
        precision: "second",
      }}
      xFormat={(t: DatumValue) =>
        t instanceof Date ? t.getMinutes() + ":" + t.getSeconds() : ""
      }
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      colors={{ scheme: "blues" }}
      axisLeft={{
        legend: "linear scale",
        legendOffset: 12,
      }}
      axisBottom={{
        format: "%d",
        tickValues: "every 2 minutes",
        legend: "t(s)",
        legendOffset: -12,
      }}
      curve={"monotoneX"}
      animate={false}
      // enablePointLabel={true}
      // pointSymbol={CustomSymbol}
      pointSize={16}
      pointBorderWidth={1}
      pointBorderColor={{
        from: "color",
        modifiers: [["darker", 0.3]],
      }}
      useMesh={true}
      enableSlices={false}
    />
  );
};

export default LineGraph;
