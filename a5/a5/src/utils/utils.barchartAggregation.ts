import { getDataset, getItemBasedOnYear } from "./utils.dataset";
import { DataSetType } from "../types/type.dataset";

export interface BarchartData {
  location: string;
  newCases: number;
  newVaccinations: number;
}

/**
 *
 * @param data
 * @param year
 */
export function getBarchartData(
  data: DataSetType[],
  year: number
): BarchartData[] {
  return data
    .map((d) => {
      const newCases = getItemBasedOnYear<number>(d, year, "new_cases").filter(
        (d) => d
      );
      const newVaccinations = getItemBasedOnYear<number>(
        d,
        year,
        "new_vaccinations"
      ).filter((d) => d);

      if (newCases === undefined || newVaccinations === undefined) {
        return null;
      }

      return {
        newCases: newCases.reduce((a, b) => a + b, 0) / 100_000,
        newVaccinations: newVaccinations.reduce((a, b) => a + b, 0) / 100_000,
        location: d.location,
      };
    })
    .filter((d) => d !== null) as BarchartData[];
}
