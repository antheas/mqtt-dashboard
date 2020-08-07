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

const TABLE_LIMIT = 30;

const TableGraph = ({
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

  const lines: {
    time: string;
    value: string;
    series: string;
  }[] = data.series
    .map((s) =>
      s.data.map((d) => ({
        id: s.id,
        x: d.x as Date,
        y: d.y as number,
      }))
    )
    .reduce((a, b) => a.concat(b), [])
    .sort((a, b) => a.x.getTime() - b.x.getTime())
    .slice(0, TABLE_LIMIT)
    .map((d) => ({
      time: d.x.toISOString(),
      value: d.y.toString(),
      series: d.id,
    }));

  return (
    <table className="graph-table">
      <tr className="graph-table__row graph-table__row--header">
        {data.series.length > 1 && (
          <th className="graph-table__header__col">Series</th>
        )}
        <th className="graph-table__header__col">Time</th>
        <th className="graph-table__header__col">Value ({graph.unit})</th>
      </tr>
      {lines.map((line) => {
        <tr className="graph-table__row">
          {data.series.length > 1 && (
            <th className="graph-table__row__col graph-table__row__col--series">
              {line.series}
            </th>
          )}
          <th className="graph-table__row__col graph-table__row__col--time">
            {line.time}
          </th>
          <th className="graph-table__row__col graph-table__row__col--value">
            {line.value}
          </th>
        </tr>;
      })}
    </table>
  );
};

export default TableGraph;
