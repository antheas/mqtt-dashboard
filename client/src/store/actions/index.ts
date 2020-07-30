import { Dashboard } from "../types";

export const UPDATE_DASHBOARDS = "UPDATE_DASHBOARDS";
export const UPDATE_HOST = "UPDATE_HOST";

export interface UpdateDashboardsAction {
  type: typeof UPDATE_DASHBOARDS;
  dashboards: Record<string, Dashboard>;
}

export interface UpdateHostAction {
  type: typeof UPDATE_HOST;
  host: string;
}

export function updateDashboards(
  dashboards: Record<string, Dashboard>
): UpdateDashboardsAction {
  return {
    type: UPDATE_DASHBOARDS,
    dashboards,
  };
}

export function updateHost(host: string): UpdateHostAction {
  return {
    type: UPDATE_HOST,
    host,
  };
}
