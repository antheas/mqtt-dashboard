export * from "./dashboard";
export * from "./graph";
import { Dashboard } from "./dashboard";

export interface State {
  host: string;
  dashboards: Record<string, Dashboard>;
}
