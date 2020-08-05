export * from "./dashboard";
export * from "./graph";
import { Dashboard } from "./dashboard";

export type TimescaleType =
  | "5m"
  | "15m"
  | "30m"
  | "1h"
  | "6h"
  | "1d"
  | "1w"
  | "1m"
  | "6m"
  | "3y";

export interface State {
  host: string;
  dashboards: Record<string, Dashboard>;
}
