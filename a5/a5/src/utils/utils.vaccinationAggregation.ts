import { DataSetType } from "../types/type.dataset";
import { getItemBasedOnYear } from "./utils.dataset";

interface VaccinationPerPopulation {
  population: number;
  location: string;
  newVaccinations: number;
  newVaccinationsPerPopulation: number;
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
