import { combineReducers } from "redux";
import { State } from "../types";
import {
  UpdateHostAction,
  UPDATE_HOST,
  UpdateDashboardsAction,
  UPDATE_DASHBOARDS,
} from "../actions";

function host(state = "", action: UpdateHostAction) {
  return action.type === UPDATE_HOST ? action.host : state;
}

function dashboards(state = {}, action: UpdateDashboardsAction) {
  return action.type === UPDATE_DASHBOARDS ? action.dashboards : state;
}

export default combineReducers<State>({
  host,
  dashboards,
});
