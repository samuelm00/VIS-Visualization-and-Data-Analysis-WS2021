import * as d3 from "d3";
import {
  colorGrid,
  colors,
  getBaDegreeData,
  getIncomeData,
} from "./model.choroplethMap";
import { BaDegreeData, IncomeData } from "./types/type.choroplethMap";

export const margin = 40;

/**
 *
 * @param plotId
 * @param currentYear
 * @param height
 * @param width
 */
export async function createScatterPlot(
  plotId: string,
  currentYear: string,
  height: number,
  width: number
) {
  const svg = d3.select(`#${plotId}`);
  if (!svg) return;
  const baDegreeData = await getBaDegreeData();
  const incomeData = await getIncomeData();
  const [xScale, yScale] = createScales(
    baDegreeData,
    currentYear,
    incomeData,
    width,
    height
  );

  svg
    .append("g")
    .attr("transform", "translate(0," + (height - margin) + ")")
    .call(d3.axisBottom(xScale));
  svg.append("g").call(d3.axisLeft(yScale));

  const data = baDegreeData.map((d, index) => ({
    name: d.State,
    baDegree: +d[currentYear] as number,
    income: +incomeData[index][currentYear] as number,
  }));

  addColorGrid(plotId, [height, width]);

  svg
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return xScale(d.baDegree);
    })
    .attr("cy", function (d) {
      return yScale(d.income);
    })
    .attr("r", 3)
    .style("fill", (d) => "black")
    .on("mouseover", function (event, data) {
      d3.select(this).style("fill", "red");
      d3.select("#scatter-tooltip")
        .style("display", "block")
        .style("opacity", 1)
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY + "px")
        .html(
          `State: ${data.name} <br /> Income: ${data.income} <br /> Ba Degrees: ${data.baDegree}`
        );
    })
    .on("mouseout", function (d) {
      d3.select(this).style("fill", "black");
      d3.select("#scatter-tooltip").style("opacity", "0");
    });
}

/**
 *
 * @param plotId
 * @param currentYear
 * @param height
 * @param width
 */
export async function updateScatterPlot(
  plotId: string,
  currentYear: string,
  height: number,
  width: number
) {
  const baDegreeData = await getBaDegreeData();
  const incomeData = await getIncomeData();
  const svg = d3.select(`#${plotId}`);
  const data = baDegreeData.map((d, index) => ({
    name: baDegreeData[index].State,
    baDegree: +d[currentYear] as number,
    income: +incomeData[index][currentYear] as number,
  }));
  const [xScale, yScale] = createScales(
    baDegreeData,
    currentYear,
    incomeData,
    width,
    height
  );
  svg
    .selectAll("circle")
    .data(data)
    .transition()
    .duration(1000)
    .attr("cx", function (d) {
      return xScale(d.baDegree);
    })
    .attr("cy", function (d) {
      return yScale(d.income);
    });
}

/**
 *
 * @param plotId
 * @param svgSize
 */
function addColorGrid(plotId: string, svgSize: [number, number]) {
  const size = Math.floor(Math.sqrt(colors.length));
  const [height, width] = svgSize;
  const svg = d3.select(`#${plotId}`);
  const range = d3.range(size);
  const baseGrid = d3.cross(range, range);
  svg
    .append("g")
    .selectAll("rect")
    .data(baseGrid)
    .enter()
    .append("rect")
    .attr("height", (height - margin) / size)
    .attr("width", (width - margin) / size)
    .attr("x", ([x]) => (x * (width - margin)) / size)
    .attr("y", ([, y]) => ((size - 1 - y) * (height - margin)) / size)
    .attr("fill", ([x, y]) => getColor(x, y, size));
}

/**
 *
 * @param baDegreeData
 * @param currentYear
 * @param width
 * @param incomeData
 * @param height
 */
function createScales(
  baDegreeData: BaDegreeData[],
  currentYear: string,
  incomeData: IncomeData[],
  width: number,
  height: number
) {
  const baData = baDegreeData.map((d) => +d[currentYear]);
  const xScale = getScale(
    [Math.min(...baData), Math.max(...baData)],
    [0, width - margin * 2]
  );
  const icData = incomeData.map((d) => +d[currentYear]);
  const yScale = getScale(
    [Math.min(...icData), Math.max(...icData)],
    [height - margin, 0]
  );
  return [xScale, yScale];
}

/**
 *
 * @param domain
 * @param range
 */
function getScale(domain: number[], range: number[]) {
  return d3.scaleLinear().domain(domain).range(range);
}

/**
 *
 * @param x
 * @param y
 * @param n
 */
export function getColor(x: number, y: number, n: number) {
  return colorGrid[y][x];
}
