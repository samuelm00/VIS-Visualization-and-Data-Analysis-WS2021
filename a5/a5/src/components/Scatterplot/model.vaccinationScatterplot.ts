import * as d3 from "d3";

const margin = 20;

function initScatterPlotContainer(height: number, width: number) {
  d3.select(`#vaccination-scatter-plot`)
    .append("g")
    .attr("height", height - margin * 2)
    .attr("width", width - margin * 3)
    .attr("id", "plot")
    .attr("transform", "translate(" + margin * 2 + "," + margin + ")");
}

export async function initVaccinationScatterPlot(
  height: number,
  width: number,
  year = 2020,
  location?: string
) {
  initVaccinationScatterPlot(height, width);
}
