import * as d3 from "d3";
import {
  BarchartData,
  getBarchartData,
} from "../../utils/utils.barchartAggregation";

const margin = 20;

/**
 *
 * @param height
 * @param width
 */
function initBarchartContainer(height: number, width: number) {
  const svgElement = d3.select("#barchart");
  return svgElement
    .append("g")
    .attr("transform", `translate(${margin * 2}, -${margin})`);
}

/**
 *
 * @param height
 * @param width
 * @param year
 */
export async function initBarchart(height: number, width: number, year = 2020) {
  const svg = initBarchartContainer(height, width);

  const data = await getBarchartData(year);

  console.log(data);

  const [xAxis, yAxis] = createScales(height, width, data.slice(0, 10));
  addAxes(svg, height, xAxis, yAxis);

  svg
    .selectAll()
    .data(data.slice(0, 10))
    .enter()
    .append("rect")
    // @ts-ignore
    .attr("x", (d) => xAxis(d.location))
    .attr("y", (d) => yAxis(d.newCases))
    .attr("height", (d) => height - yAxis(d.newCases))
    .attr("width", (d) => xAxis.bandwidth());
}

/**
 *
 * @param height
 * @param width
 * @param data
 */
function createScales(
  height: number,
  width: number,
  data: BarchartData[]
): [d3.ScaleBand<string>, d3.ScaleLinear<number, number, never>] {
  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.location))
    .range([0, width - margin * 2])
    .padding(0.1);

  const maxVaccinations = Math.max(...data.map((d) => d.newVaccinations));
  const maxCases = Math.max(...data.map((d) => d.newCases));

  const yScale = d3
    .scaleLinear()
    .domain([0, Math.max(maxVaccinations, maxCases)])
    .range([height, 0]);

  return [xScale, yScale];
}

/**
 *
 * @param svg
 * @param height
 * @param xAxis
 * @param yAxis
 */
function addAxes(svg: any, height: number, xAxis: any, yAxis: any) {
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xAxis));
  svg.append("g").call(d3.axisLeft(yAxis));
}
