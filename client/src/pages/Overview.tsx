import React from "react";
import { connect } from "react-redux";
import { selectDashboards, selectHost } from "../store/selectors";
import { State, Dashboard } from "../store/types";
import { Link } from "react-router-dom";

const Overview: React.FunctionComponent<{
  host: string;
  dashboards: Dashboard[];
}> = ({ host, dashboards }) => {
  return (
    <div className="overview">
      <h2 className="overview__header">Dashboards</h2>
      <h3 className="overview__host">{host}</h3>
      <div className="dashboards">
        {dashboards.map((d) => (
          <Link
            to={`dashboard/${d.id}`}
            className="dashboards__item"
            key={d.id}
          >
            <div className="dashboards__item__id">{d.id}</div>
            <div className="dashboards__item__name">{d.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state: State) => {
  return {
    host: selectHost(state),
    dashboards: selectDashboards(state),
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
