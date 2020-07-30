export * from "./dashboard";
import { Dashboard } from "./dashboard";

export interface State {
  host: string;
  dashboards: Record<string, Dashboard>;
}
