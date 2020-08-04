import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { selectDashboard } from "../store/selectors";
import {
  State,
  Dashboard as DashboardType,
  isSingleRow,
  Row,
  isDoubleRow,
  isTripleRow,
  AbstractGraphApi,
} from "../store/types";
import { useHistory } from "react-router-dom";
import CompositeGraph from "../components/CompositeGraph";
import GraphApiContext, {
  StubGraphApi,
  GraphApi,
} from "../store/api/GraphApiProvider";

const RowComponent = ({ row: r }: { row: Row }) => {
  if (isSingleRow(r)) {
    return (
      <div className="row row--single">
        <CompositeGraph graph={r.graph} className="graph--full" />
      </div>
    );
  } else if (isDoubleRow(r) && r.split === "oox") {
    return (
      <div className="row row--double">
        <CompositeGraph graph={r.graph1} className="graph--two-thirds" />
        <CompositeGraph graph={r.graph2} className="graph--third" />
      </div>
    );
  } else if (isDoubleRow(r) && r.split === "oxx") {
    return (
      <div className="row row--double">
        <CompositeGraph graph={r.graph1} className="graph--third" />
        <CompositeGraph graph={r.graph2} className="graph--two-thirds" />
      </div>
    );
  } else if (isDoubleRow(r) && r.split === "ox") {
    return (
      <div className="row row--double">
        <CompositeGraph graph={r.graph1} className="graph--half" />
        <CompositeGraph graph={r.graph2} className="graph--half" />
      </div>
    );
  } else if (isTripleRow(r)) {
    return (
      <div className="row row--triple">
        <CompositeGraph graph={r.graph1} className="graph--third" />
        <CompositeGraph graph={r.graph2} className="graph--third" />
        <CompositeGraph graph={r.graph3} className="graph--third" />
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
  const [api, setApi] = useState(new StubGraphApi() as AbstractGraphApi);

  useEffect(() => {
    if (!dashboard) return;

    const api = new GraphApi("http://sensors.lan:5000", 5000, false);
    setApi(api);

    return () => {
      api.destroy();
    };
  }, [dashboard]);

  if (!dashboard) {
    history.push("/");
    return <div className="dashboard" />;
  }

  return (
    <div className="dashboard">
      <GraphApiContext.Provider value={api}>
        {dashboard.name && (
          <h1 className="dashboard__header">{dashboard.name}</h1>
        )}
        {dashboard.rows.map((r, i) => (
          <RowComponent key={i} row={r} />
        ))}
      </GraphApiContext.Provider>
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
