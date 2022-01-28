import * as d3 from "d3";
import { getDataset, getItemBasedOnYear } from "../../utils/utils.dataset";
import { DataSetType } from "../../types/type.dataset";
import { AggregationProps } from "../CustomAggregator/CustomAggregetor";

const margin = 20;

interface YAxisData {
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
    .attr("width", width - margin * 2)
    .attr("id", "plot")
    .attr("transform", "translate(" + margin + "," + margin + ")");
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
  const data = await getDataset();
  const totalCasesPerPopulation = getTotalCasesPerPopulation(data, year);
  const weightedData = getWeightedData(
    data,
    year,
    weights,
    percentages,
    category
  );
  console.log("totalCasesPerPopulation", totalCasesPerPopulation);
  console.log("weightedData", weightedData);
}

/**
 *
 * @param data
 * @param year
 */
function getTotalCasesPerPopulation(
  data: DataSetType[],
  year: number
): YAxisData[] {
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
  return totalCasesPerPopulation.filter((d) => d !== null) as YAxisData[];
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
