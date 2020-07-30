import React from "react";
import { connect } from "react-redux";
import { selectDashboard } from "../store/selectors";
import { State, Dashboard as DashboardType } from "../store/types";

interface IProps {
  id: string;
  dashboard?: DashboardType;
}

const Dashboard: React.FunctionComponent<IProps> = (props) => {
  return <div className="dashboard"></div>;
};

const mapStateToProps = (state: State, { id }: { id: string }) => {
  return {
    dashboard: selectDashboard(state, id),
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
