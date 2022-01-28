import { json } from "d3";

export async function getDataset() {
  return json("/owid-covid-data.json");
}
