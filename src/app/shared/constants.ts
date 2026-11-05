import { ChartConfiguration } from "chart.js";

export const DIALOG_SMALL_HEIGHT = "250px";
export const DIALOG_SMALL_WIDTH = "400px";

/** Options of the charts, with text and grid colors readable in the light or dark theme. */
export function getChartOptions(isDarkMode: boolean): ChartConfiguration["options"] {
  const textColor = isDarkMode ? "#9ca3af" : "#6b7280";
  const gridColor = isDarkMode ? "rgb(148 163 184 / 15%)" : "rgb(148 163 184 / 25%)";
  return {
    responsive: true,
    color: textColor,
    plugins: {
      legend: { display: true, position: "bottom", labels: { usePointStyle: true, boxWidth: 8 } }
    },
    elements: {
      bar: { borderRadius: 6 },
      line: { tension: 0.3, borderWidth: 2 },
      point: { radius: 3, hoverRadius: 5 }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: textColor } },
      y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: textColor } }
    }
  };
}
