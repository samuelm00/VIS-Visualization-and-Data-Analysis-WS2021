import * as d3 from "d3";
import { getDataset, getItemBasedOnYear } from "../../utils/utils.dataset";
import { DataSetType } from "../../types/type.dataset";
import { AggregationProps } from "../CustomAggregator/CustomAggregetor";
import { Axis, ScaleLinear } from "d3";

const margin = 20;

interface CasesPerPopulationData {
  location: string;
  totalCases: number;
  population: number;
  casesPerPopulation: number;
}

interface WeightedData {
  location: string;
  weight: number;
}

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
    .attr("transform", "translate(" + margin * 3 + "," + 0 + ")");
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

  // get and aggregate the data
  const data = await getDataset();
  const totalCasesPerPopulation = getTotalCasesPerPopulation(data, year);
  const weightedData = getWeightedData(
    data,
    year,
    weights,
    percentages,
    category
  );
  const scatterPlotData = weightedData
    .map((weightedData) => {
      const casesPerPopulation = totalCasesPerPopulation.find(
        (d) => d.location === weightedData.location
      );
      if (casesPerPopulation) {
        return {
          location: weightedData.location,
          weight: weightedData.weight,
          casesPerPopulation: casesPerPopulation.casesPerPopulation,
        };
      }
      return null;
    })
    .filter((d) => d !== null);

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
    .attr("r", 3)
    .attr("fill", "black");
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
  console.log(casesPerPopulation.map((d) => d.casesPerPopulation));

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

/**
 *
 * @param data
 * @param year
 */
function getTotalCasesPerPopulation(
  data: DataSetType[],
  year: number
): CasesPerPopulationData[] {
  const totalCasesPerPopulation = data.map((d) => {
    const totalCases = getItemBasedOnYear<number>(d, year, "total_cases");
    if (!totalCases) {
      return null;
    }
    return {
      location: d.location,
      totalCases,
      population: d.population,
      casesPerPopulation: totalCases / d.population,
    };
  });
  return totalCasesPerPopulation.filter(
    (d) => d !== null && !isNaN(d.casesPerPopulation)
  ) as CasesPerPopulationData[];
}

/**
 *
 * @param data
 * @param year
 * @param weights
 * @param percentages
 * @param category
 */
function getWeightedData(
  data: DataSetType[],
  year: number,
  weights: AggregationProps,
  percentages: AggregationProps,
  category: keyof AggregationProps
): WeightedData[] {
  return data.map((d) => {
    const individualWeightsPercentages = Object.keys(weights[category]).map(
      (key) => {
        // @ts-ignore
        const weight = weights[category][key];
        // @ts-ignore
        const percentage = percentages[category][key];
        return { weight, percentage, key };
      }
    );
    const totalWeight = individualWeightsPercentages.reduce(
      (acc, curr) =>
        acc +
        getWeight(curr.weight, curr.percentage, getValue(d, curr.key, year)),
      0
    );
    return {
      location: d.location,
      weight: totalWeight,
    };
  });
}

/**
 *
 * @param value
 * @param weight
 * @param percentage
 */
function getWeight(weight: number, percentage: number, value?: number) {
  if (!value) return 0;
  if (value > percentage) return weight;
  return 0;
}

/**
 *
 * @param value
 * @param key
 */
function getValue(value: DataSetType, key: string, year: number): number {
  // TODO: ADD MISSING KEYS
  if (key.toLowerCase().includes("people")) {
    return value.aged_65_older || 0;
  }
  if (key.toLowerCase().includes("smokers")) {
    return (value.female_smokers || 0) + (value.male_smokers || 0);
  }
  return 0;
}
