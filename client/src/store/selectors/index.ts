import { State, Dashboard } from "../types";

export function selectDashboards(state: State) {
  return state.dashboards;
}

export function selectDashboard(state: State, id: string): Dashboard | null {
  const dashboards = selectDashboards(state);

  if (id in dashboards) {
    return dashboards[id];
  } else {
    return null;
  }
}
