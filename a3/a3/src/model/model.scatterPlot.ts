import * as d3 from "d3";
import {
  colors,
  getBaDegreeData,
  getColor,
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
  const [xScale, yScale] = addScales(
    "plot",
    baDegreeData,
    currentYear,
    incomeData,
    width,
    height
  );

  const data = baDegreeData.map((d, index) => ({
    baDegree: +d[currentYear] as number,
    income: +incomeData[index][currentYear] as number,
  }));

  const n = Math.floor(Math.sqrt(colors.length));
  const x = d3.scaleQuantile(
    baDegreeData.map((d) => d[currentYear] as number),
    d3.range(n)
  );
  const y = d3.scaleQuantile(
    baDegreeData.map((d) => d[currentYear] as number),
    d3.range(n)
  );

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
    .style("fill", (d) => getColor(d.income, d.baDegree, x, y, n));
}

/**
 *
 * @param plotId
 * @param baDegreeData
 * @param currentYear
 * @param width
 * @param incomeData
 * @param height
 */
function addScales(
  plotId: string,
  baDegreeData: BaDegreeData[],
  currentYear: string,
  incomeData: IncomeData[],
  width: number,
  height: number
) {
  const xScale = getScale(
    [0, getMax(baDegreeData.map((d) => d[currentYear]) as number[])],
    [0, width - margin * 2]
  );
  const yScale = getScale(
    [0, getMax(incomeData.map((d) => d[currentYear]) as number[])],
    [height - margin * 2, 0]
  );

  const svg = d3.select(`#${plotId}`);
  svg
    .append("g")
    .attr("transform", "translate(0," + (height - margin * 2) + ")")
    .call(d3.axisBottom(xScale));
  svg.append("g").call(d3.axisLeft(yScale));

  return [xScale, yScale];
}

const getMax = (data: number[]) => {
  return Math.max(...data);
};

/**
 *
 * @param domain
 * @param range
 */
function getScale(domain: number[], range: number[]) {
  return d3.scaleLinear().domain(domain).range(range);
}
