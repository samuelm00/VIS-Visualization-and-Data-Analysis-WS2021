import { json } from "d3";
import { DataSetType, TimeDataMeasurements } from "../types/type.dataset";

const BASE_PROD = "/~samuelm00/VIS21W/A5/data";
const BASE_DEV = "/~samuelm00/VIS21W/A5";

export async function getDataset(): Promise<DataSetType[]> {
  const base = window.location.hostname === "localhost" ? BASE_DEV : BASE_PROD;
  const data: any = await json(`${base}/owid-covid-data.json`);
  if (!data) throw Error("No data");
  const dataArr = Object.keys(data).map((key) => ({ ...data[key] }));
  return dataArr as DataSetType[];
}

/**
 *
 * @param data
 * @param year
 * @param key
 */
export function getItemBasedOnYear<T>(
  data: DataSetType,
  year: number,
  key: keyof TimeDataMeasurements
): T[] {
  return data.data
    .filter(({ date }) => {
      if (!date) {
        return false;
      }
      return new Date(date).getFullYear() === year;
    })
    .map((d) => d[key]) as unknown as T[];
}
