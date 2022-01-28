import { json } from "d3";
import { DataSetType } from "../types/type.dataset";

export async function getDataset(): Promise<DataSetType[]> {
  const data = await json("/owid-covid-data.json");
  if (!data) throw Error("No data");
  return data as DataSetType[];
}
