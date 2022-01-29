import * as d3 from "d3";
import { getDataset, getItemBasedOnYear } from "../../utils/utils.dataset";
import { DataSetType } from "../../types/type.dataset";
import { AggregationProps } from "../CustomAggregator/CustomAggregetor";
import { Axis, ScaleLinear } from "d3";
import {
  CasesPerPopulationData,
  getDatasetsForWeightedScatterPlot,
  getTotalCasesPerPopulation,
  getWeightedData,
} from "../../utils/utils.weightedAggregation";

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
    .attr("width", width - margin * 3)
    .attr("id", "plot")
    .attr("transform", "translate(" + margin * 2 + "," + margin + ")");
}

/**
 *
 * @param height
 * @param width
 * @param year
 * @param weights
 * @param percentages
 * @param category
 */
export async function initScatterPlot(
  height: number,
  width: number,
  year = 2020,
  weights: AggregationProps,
  percentages: AggregationProps,
  category: keyof AggregationProps
) {
  initScatterPlotContainer(height, width);
  const svg = d3.select("#plot");

  const { totalCasesPerPopulation, scatterPlotData } =
    await getDatasetsForWeightedScatterPlot(
      year,
      weights,
      percentages,
      category
    );

  // add and create x and y axis
  const [xScale, yScale] = createScales(
    height,
    width,
    year,
    weights,
    totalCasesPerPopulation,
    category
  );
  const [xAxis, yAxis] = getAxes(xScale, yScale);
  addAxes(svg, height, xAxis, yAxis);

  svg
    .append("g")
    .attr("id", "data-points")
    .selectAll("dot")
    .data(scatterPlotData)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d!.casesPerPopulation))
    .attr("cy", (d) => yScale(d!.weight))
    .attr("r", 5)
    .attr("fill", "black")
    .on("mouseover", function (event, data) {
      d3.select(this).style("fill", "red");
      d3.select("#scatter-tooltip")
        .style("display", "block")
        .style("opacity", 1)
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY + "px")
        .html(
          `State: ${data?.location} <br /> Cases/Populatin: ${data?.casesPerPopulation} <br /> Weight: ${data?.weight}`
        );
    })
    .on("mouseout", function (event, data) {
      d3.select(this).style("fill", "black");
      d3.select("#scatter-tooltip")
        .style("opacity", "0")
        .style("left", "-1000px");
    });
}

/**
 *
 * @param height
 * @param width
 * @param year
 * @param weights
 * @param casesPerPopulation
 * @param category
 */
function createScales(
  height: number,
  width: number,
  year: number,
  weights: AggregationProps,
  casesPerPopulation: CasesPerPopulationData[],
  category: keyof AggregationProps
) {
  const minWeight = 0;
  const maxWeight = Object.values(weights[category]).reduce(
    (acc, curr) => acc + curr,
    0
  );
  const yScale = getScale([minWeight, maxWeight], [height - margin * 2, 0]);

  const minCasesPerPopulation = 0;

  const maxCasesPerPopulation = Math.max(
    ...casesPerPopulation.map((d) => d.casesPerPopulation)
  );

  const xScale = getScale(
    [minCasesPerPopulation, maxCasesPerPopulation],
    [0, width - margin * 3]
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
 * @param xScale
 * @param yScale
 */
function getAxes(
  xScale: ScaleLinear<number, number, never>,
  yScale: ScaleLinear<number, number, never>
) {
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  return [xAxis, yAxis];
}

/**
 *
 * @param svg
 * @param height
 * @param xAxis
 * @param yAxis
 */
function addAxes(
  svg: any,
  height: number,
  xAxis: Axis<number | { valueOf(): number }>,
  yAxis: Axis<number | { valueOf(): number }>
) {
  svg
    .append("g")
    .attr("transform", "translate(0," + (height - margin * 2) + ")")
    .attr("id", "xAxis")
    .call(xAxis);
  svg.append("g").attr("id", "yAxis").call(yAxis);
}
