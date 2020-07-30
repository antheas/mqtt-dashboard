import React from "react";
import { connect } from "react-redux";
import { selectDashboard } from "../store/selectors";
import {
  State,
  Dashboard as DashboardType,
  isSingleRow,
  Row,
  isDoubleRow,
  isTripleRow,
  Graph,
} from "../store/types";
import { useHistory } from "react-router-dom";

const GraphComponent = ({
  graph: g,
  className,
}: {
  graph: Graph;
  className: string;
}) => {
  if (g) {
    return (
      <div className={`graph graph--empty ${className}`}>
        <div className="bigrectangle"></div>
      </div>
    );
  } else {
    return <div className={`graph graph--empty ${className}`} />;
  }
};

const RowComponent = ({ row: r }: { row: Row }) => {
  if (isSingleRow(r)) {
    return (
      <div className="row row--single">
        <GraphComponent graph={r.graph} className="graph--full" />
      </div>
    );
  } else if (isDoubleRow(r) && r.split === "oox") {
    return (
      <div className="row row--triple">
        <GraphComponent graph={r.graph1} className="graph--two-thirds" />
        <GraphComponent graph={r.graph2} className="graph--third" />
      </div>
    );
  } else if (isDoubleRow(r) && r.split === "oxx") {
    return (
      <div className="row row--triple">
        <GraphComponent graph={r.graph1} className="graph--third" />
        <GraphComponent graph={r.graph2} className="graph--two-thirds" />
      </div>
    );
  } else if (isDoubleRow(r) && r.split === "ox") {
    return (
      <div className="row row--triple">
        <GraphComponent graph={r.graph1} className="graph--half" />
        <GraphComponent graph={r.graph2} className="graph--half" />
      </div>
    );
  } else if (isTripleRow(r)) {
    return (
      <div className="row row--triple">
        <GraphComponent graph={r.graph1} className="graph--third" />
        <GraphComponent graph={r.graph2} className="graph--third" />
        <GraphComponent graph={r.graph3} className="graph--third" />
      </div>
    );
  }
  return <></>;
};

interface IProps {
  id: string;
  dashboard?: DashboardType;
}

const Dashboard: React.FunctionComponent<IProps> = ({ dashboard }) => {
  const history = useHistory();

  if (!dashboard) {
    history.push("/");
    return <div className="dashboard" />;
  }

  return (
    <div className="dashboard">
      {dashboard.name && (
        <h1 className="dashboard__header">{dashboard.name}</h1>
      )}
      {dashboard.rows.map((r, i) => (
        <RowComponent key={i} row={r} />
      ))}
    </div>
  );
};

const mapStateToProps = (state: State, { id }: { id: string }) => {
  return {
    dashboard: selectDashboard(state, id),
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
