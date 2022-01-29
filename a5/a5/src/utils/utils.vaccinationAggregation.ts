import { DataSetType } from "../types/type.dataset";
import { getDataset, getItemBasedOnYear } from "./utils.dataset";

export interface VaccinationPerPopulation {
  population: number;
  location: string;
  newVaccinations: number;
  newVaccinationsPerPopulation: number;
}

export interface PositiveRate {
  location: string;
  positiveRate: number;
}

/**
 *
 * @param data
 * @param year
 */
function getNewVaccinationsPerPopulation(
  data: DataSetType[],
  year: number
): VaccinationPerPopulation[] {
  return data
    .map((d) => {
      const newVaccinationsArr = getItemBasedOnYear<number>(
        d,
        year,
        "new_vaccinations"
      ).filter((v) => v);

      if (!newVaccinationsArr.length) {
        return null;
      }

      const newVaccinations =
        newVaccinationsArr.reduce((a, b) => a + b, 0) /
        newVaccinationsArr.length;

      if (!newVaccinations || !d.location) return null;

      return {
        location: d.location,
        newVaccinations,
        population: d.population,
        newVaccinationsPerPopulation: newVaccinations / d.population,
      };
    })
    .filter((d) => d !== null) as VaccinationPerPopulation[];
}

/**
 *
 * @param data
 * @param year
 */
function getPositiveRateData(
  data: DataSetType[],
  year: number
): PositiveRate[] {
  return data
    .map((d) => {
      const positiveRateArr = getItemBasedOnYear<number>(
        d,
        year,
        "positive_rate"
      ).filter((d) => d);

      if (!positiveRateArr.length) {
        return null;
      }

      const positiveRate =
        positiveRateArr.reduce((a, b) => a + b, 0) / positiveRateArr.length;

      if (!positiveRate || !d.location) return null;
      return {
        location: d.location,
        positiveRate,
      };
    })
    .filter((d) => d !== null) as PositiveRate[];
}

/**
 *
 * @param data
 * @param year
 */
export async function getVaccinationScatterPlotData(
  data: DataSetType[],
  year: number
) {
  const newVaccinationsPerPopulation = getNewVaccinationsPerPopulation(
    data,
    year
  );
  const positiveRateData = getPositiveRateData(data, year);
  const scatterPlotData = positiveRateData
    .map((d) => {
      const newVaccinationsPerPopulationData =
        newVaccinationsPerPopulation.find((d2) => d2.location === d.location);
      if (!newVaccinationsPerPopulationData) return null;
      return {
        location: d.location,
        positiveRate: d.positiveRate,
        newVaccinationsPerPopulation:
          newVaccinationsPerPopulationData.newVaccinationsPerPopulation,
      };
    })
    .filter((d) => d !== null);
  return {
    scatterPlotData,
    newVaccinationsPerPopulation,
    positiveRateData,
  };
}
