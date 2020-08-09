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
    key: string;
  }[] = data.series
    .map((s) =>
      s.data.map((d) => ({
        id: s.id,
        x: d.x as Date,
        y: d.y as number,
        key: d.key,
      }))
    )
    .reduce((a, b) => a.concat(b), [])
    .sort((a, b) => a.x.getTime() - b.x.getTime())
    .slice(0, TABLE_LIMIT)
    .map((d) => ({
      time: `${d.x.getHours()}:${d.x.getMinutes()}:${d.x.getSeconds()},${d.x.getMilliseconds()} ${d.x.getDay()}/${d.x.getMonth()}`,
      value: d.y.toString(),
      series: d.id.toString(),
      key: d.key,
    }))
    .reverse();

  return (
    <table className="graph-table">
      <thead className="table-header">
        <tr className="table-header__row table-header__row--header">
          {data.series.length > 1 && (
            <th className="table-header__header__cell table-header__row__cell--series">
              Series
            </th>
          )}
          <th className="table-header__header__cell table-header__row__cell--time">
            Time
          </th>
          <th className="table-header__header__cell table-header__row__cell--value">
            Value ({graph.unit})
          </th>
        </tr>
      </thead>
      <tbody className="table-body">
        {lines.map((line) => (
          // Fixme: key calculation
          <tr className="table-body__row" key={line.key}>
            {data.series.length > 1 && (
              <td className="table-body__row__cell table-body__row__cell--series">
                {line.series}
              </td>
            )}
            <td className="table-body__row__cell table-body__row__cell--time">
              {line.time}
            </td>
            <td className="table-body__row__cell table-body__row__cell--value">
              {line.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableGraph;
