import * as d3 from "d3";

const margin = 20;

/**
 *
 * @param height
 * @param width
 */
function initScatterPlotContainer(height: number, width: number) {
  d3.select(`#scatter-plot`)
    .append("g")
    .attr("height", height - margin * 2)
    .attr("width", width - margin * 2)
    .attr("id", "plot")
    .attr("transform", "translate(" + margin + "," + margin + ")");
}

/**
 *
 * @param height
 * @param width
 */
export function initScatterPlot(height: number, width: number) {
  initScatterPlotContainer(height, width);
  const svg = d3.select("#plot");
}
