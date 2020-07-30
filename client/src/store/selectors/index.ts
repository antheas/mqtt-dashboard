import { Dashboard, State } from "../types";

export function selectDashboards(state: State) {
  return Object.entries(state.dashboards).map(([, value]) => value);
}

export function selectDashboard(
  state: State,
  id: string
): Dashboard | undefined {
  const dashboards = state.dashboards;

  if (id in dashboards) {
    return dashboards[id];
  } else {
    return undefined;
  }
}

export function selectHost(state: State) {
  return state.host;
}
