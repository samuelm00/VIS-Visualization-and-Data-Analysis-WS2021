import { DataSetType } from "../types/type.dataset";
import { getDataset, getItemBasedOnYear } from "./utils.dataset";

interface VaccinationPerPopulation {
  population: number;
  location: string;
  newVaccinations: number;
  newVaccinationsPerPopulation: number;
}

interface PositiveRate {
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
  return data.map((d) => {
    const newVaccinations = getItemBasedOnYear<number>(
      d,
      year,
      "new_vaccinations"
    );

    if (!newVaccinations || !d.location) return null;

    return {
      location: d.location,
      newVaccinations,
      population: d.population,
      newVaccinationsPerPopulation: newVaccinations / d.population,
    };
  }) as VaccinationPerPopulation[];
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
  return data.map((d) => {
    const positiveRate = getItemBasedOnYear<number>(d, year, "positive_rate");
    if (!positiveRate || !d.location) return null;
    return {
      location: d.location,
      positiveRate,
    };
  }) as PositiveRate[];
}

/**
 *
 * @param year
 */
export async function getVaccinationScatterPlotData(year: number) {
  const data = await getDataset();
  const newVaccinationsPerPopulation = getNewVaccinationsPerPopulation(
    data,
    year
  );
  const positiveRateData = getPositiveRateData(data, year);
  const scatterPlotData = positiveRateData.map((d) => {
    const newVaccinationsPerPopulationData = newVaccinationsPerPopulation.find(
      (d2) => d2.location === d.location
    );
    if (!newVaccinationsPerPopulationData) return null;
    return {
      location: d.location,
      positiveRate: d.positiveRate,
      newVaccinationsPerPopulation:
        newVaccinationsPerPopulationData.newVaccinationsPerPopulation,
    };
  });
  return {
    scatterPlotData,
    newVaccinationsPerPopulation,
    positiveRateData,
  };
}
