import { DataSetType } from "../types/type.dataset";
import { getDataset, getItemBasedOnYear } from "./utils.dataset";
import { AggregationProps } from "../components/CustomAggregator/CustomAggregetor";

export interface CasesPerPopulationData {
  location: string;
  totalCases: number;
  population: number;
  casesPerPopulation: number;
}

export interface WeightedData {
  location: string;
  weight: number;
}

/**
 *
 * @param data
 * @param year
 */
export function getTotalCasesPerPopulation(
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
export function getWeightedData(
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
export function getWeight(weight: number, percentage: number, value?: number) {
  if (!value) return 0;
  if (value > percentage) return weight;
  return 0;
}

/**
 *
 * @param value
 * @param key
 */
export function getValue(
  value: DataSetType,
  key: string,
  year: number
): number {
  // TODO: ADD MISSING KEYS
  if (key.toLowerCase().includes("people")) {
    return value.aged_65_older || 0;
  }
  if (key.toLowerCase().includes("smokers")) {
    return (value.female_smokers || 0) + (value.male_smokers || 0);
  }
  return 0;
}

/**
 *
 * @param year
 * @param weights
 * @param percentages
 * @param category
 */
export async function getDatasetsForWeightedScatterPlot(
  year: number,
  weights: AggregationProps,
  percentages: AggregationProps,
  category: "People" | "Development"
) {
  const data = await getDataset();

  console.log(data);
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
  return { totalCasesPerPopulation, scatterPlotData };
}
