import * as d3 from "d3";
import { AggregationProps } from "../CustomAggregator/CustomAggregetor";
import { Axis, ScaleLinear } from "d3";
import {
  CasesPerPopulationData,
  getDatasetsForWeightedScatterPlot,
} from "../../utils/utils.weightedAggregation";
import { DataSetType } from "../../types/type.dataset";
import { colors, getColor } from "../WorldMap/model.worldMap";

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
    .attr("transform", "translate(" + margin * 2.6 + "," + margin + ")");
}

/**
 *
 * @param height
 * @param width
 * @param year
 * @param data
 * @param weights
 * @param percentages
 * @param category
 */
export function initWeightedScatterPlot(
  height: number,
  width: number,
  year = 2020,
  data: DataSetType[],
  weights: AggregationProps,
  percentages: AggregationProps,
  category: keyof AggregationProps
) {
  initScatterPlotContainer(height, width);
  const svg = d3.select("#plot");
  addColorGrid("plot", [height, width]);

  const { totalCasesPerPopulation, scatterPlotData } =
    getDatasetsForWeightedScatterPlot(
      year,
      data,
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
  addLabels(svg, height, width, "Weights", "Cases/Population");

  svg
    .append("g")
    .attr("id", "data-points")
    .selectAll("dot")
    .data(scatterPlotData)
    .enter()
    .append("circle")
    .attr("z-index", 1)
    .attr("cx", (d) => xScale(d!.casesPerPopulation))
    .attr("cy", (d) => yScale(d!.weight))
    .attr("r", 5)
    .attr("fill", "black");
  addHoverEffect(svg, scatterPlotData);
}

/**
 *
 * @param height
 * @param width
 * @param year
 * @param data
 * @param weights
 * @param percentages
 * @param category
 */
export function updateWeightedScatterPlot(
  height: number,
  width: number,
  year = 2020,
  data: DataSetType[],
  weights: AggregationProps,
  percentages: AggregationProps,
  category: keyof AggregationProps,
  currentLocation: string
) {
  const svg = d3.select("#plot");

  const { totalCasesPerPopulation, scatterPlotData } =
    getDatasetsForWeightedScatterPlot(
      year,
      data,
      weights,
      percentages,
      category
    );

  const [xScale, yScale] = createScales(
    height,
    width,
    year,
    weights,
    totalCasesPerPopulation,
    category
  );
  const [xAxis, yAxis] = getAxes(xScale, yScale);
  updateAxes(svg, xAxis, yAxis);

  svg.selectAll("circle").remove();

  svg
    .append("g")
    .attr("id", "data-points")
    .selectAll("dot")
    .data(scatterPlotData)
    .enter()
    .append("circle")
    .transition()
    .duration(1000)
    .attr("z-index", 1)
    .attr("cx", (d) => xScale(d!.casesPerPopulation))
    .attr("cy", (d) => yScale(d!.weight))
    .attr("r", 5)
    .attr("fill", (d) => {
      if (d?.location === currentLocation) {
        return "#ff5724";
      }
      return "black";
    });

  addHoverEffect(svg, scatterPlotData, currentLocation);
}

/**
 *
 * @param svg
 * @param scatterPlotData
 */
function addHoverEffect(
  svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
  scatterPlotData: ({
    location: string;
    weight: number;
    casesPerPopulation: number;
  } | null)[],
  location?: string
) {
  svg
    .selectAll("circle")
    .data(scatterPlotData)
    .on("mouseover", function (event, data) {
      d3.select(this).style("fill", "#ff5724");
      d3.select("#scatter-tooltip")
        .style("display", "block")
        .style("opacity", 1)
        .style("right", window.innerWidth - event.pageX - 5 + "px")
        .style("top", event.pageY + "px")
        .html(
          `State: ${data?.location} <br /> Cases/Populatin: ${data?.casesPerPopulation} <br /> Weight: ${data?.weight}`
        );
    })
    .on("mouseout", function (event, data) {
      if (location !== data?.location) {
        d3.select(this).style("fill", "black");
      }
      d3.select("#scatter-tooltip")
        .style("opacity", "0")
        .style("right", "-1000px");
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
export function getScale(domain: number[], range: number[]) {
  return d3.scaleLinear().domain(domain).range(range);
}

/**
 *
 * @param xScale
 * @param yScale
 */
export function getAxes(
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
export function addAxes(
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

/**
 *
 * @param svg
 * @param xAxis
 * @param yAxis
 */
export function updateAxes(
  svg: any,
  xAxis: Axis<any | { valueOf(): any }>,
  yAxis: Axis<any | { valueOf(): any }>
) {
  svg.selectAll("#xAxis").transition().duration(200).call(xAxis);
  svg.selectAll("#yAxis").transition().duration(200).call(yAxis);
}

/**
 *
 * @param svg
 * @param height
 * @param width
 * @param xLabel
 * @param yLabel
 */
export function addLabels(
  svg: any,
  height: number,
  width: number,
  xLabel: string,
  yLabel: string
) {
  svg
    .append("text")
    .attr("x", -margin * 4)
    .attr("y", -40)
    .attr("transform", "rotate(-90)")
    .style("fill", "white")
    .attr("text-anchor", "middle")
    .attr("class", "text-xs")
    .text(xLabel);

  svg
    .append("text")
    .attr("x", width - margin * 8)
    .attr("y", 470)
    .style("fill", "white")
    .attr("text-anchor", "start")
    .attr("class", "text-xs")
    .text(yLabel);
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
    .attr("height", (height - margin * 2) / size)
    .attr("width", (width - margin * 2) / size)
    .attr("x", ([x]) => (x * (width - margin * 2)) / size)
    .attr("y", ([, y]) => ((size - 1 - y) * (height - margin * 2)) / size)
    .attr("fill", ([x, y]) => getColor(x, y));
}
