import { ChartConfiguration } from "chart.js";

export const DIALOG_SMALL_HEIGHT = "250px";
export const DIALOG_SMALL_WIDTH = "400px";

export const CHART_OPTIONS: ChartConfiguration["options"] = {
  responsive: true,
  plugins: { legend: { display: true } }
};
