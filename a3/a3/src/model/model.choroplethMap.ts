import * as d3 from "d3";
import { BaDegreeData, GeoData, IncomeData } from "./types/type.choroplethMap";
import { GeoProjection } from "d3";

export const colors = [
  "#e6e6e6",
  "#96d9d9",
  "#2dc9c9",
  "#a3c7ce",
  "#6bbdc3",
  "#20afb4",
  "#60a9b5",
  "orange", //"#3fa0ac",
  "#13949f",
];

export const colorGrid = [
  colors.slice(0, 3),
  colors.slice(3, 6),
  colors.slice(6, 9),
];

const n = Math.floor(Math.sqrt(colors.length));
const x = d3.scaleThreshold([27, 38], d3.range(n));
const y = d3.scaleThreshold([37000, 46000], d3.range(n));

/**
 *
 * @param height
 * @param width
 */
export async function basicMap(
  height: number,
  width: number
): Promise<GeoProjection> {
  return d3.geoAlbersUsa();
}
/**
 *
 * @param svgId
 * @param currentYear
 */
export async function createMap(svgId: string, currentYear: string) {
  const svg = d3.select(`#${svgId}`);
  if (!svg) return;
  const baDegreeData = await getBaDegreeData();
  const incomeData = await getIncomeData();
  const geoData = (await d3.json("/data/us-states-geo.json")) as GeoData;
  const projection = await basicMap(+svg.attr("height"), +svg.attr("width"));

  // draw the map
  svg
    .append("g")
    .selectAll("path")
    .data(geoData.features)
    .enter()
    .append("path")
    .attr("d", d3.geoPath().projection(projection))
    .attr("stroke", "white")
    .attr("fill", (d) => {
      const baDegreeValue = baDegreeData.find(
        (x) => x.State === d.properties.name
      );
      const incomeValue = incomeData.find((x) => x.State === d.properties.name);

      if (!incomeValue || !baDegreeValue) return "white";

      return getColor(+incomeValue[currentYear], +baDegreeValue[currentYear]);
    });
}

/**
 *
 * @param svgId
 * @param currentYear
 */
export async function updateMap(svgId: string, currentYear: string) {
  const svg = d3.select(`#${svgId}`);
  if (!svg) return;
  const baDegreeData = await getBaDegreeData();
  const incomeData = await getIncomeData();
  const geoData = (await d3.json("/data/us-states-geo.json")) as GeoData;

  // draw the map
  svg
    .selectAll("path")
    .data(geoData.features)
    .transition()
    .duration(1000)
    .attr("fill", (d) => {
      const baDegreeValue = baDegreeData.find(
        (x) => x.State === d.properties.name
      );
      const incomeValue = incomeData.find((x) => x.State === d.properties.name);

      if (!incomeValue || !baDegreeValue) return "white";

      console.log(incomeValue[currentYear], +baDegreeValue[currentYear]);
      console.log(y(+incomeValue[currentYear]), x(+baDegreeValue[currentYear]));
      console.log(
        getColor(+incomeValue[currentYear], +baDegreeValue[currentYear])
      );
      console.log("\n");

      return getColor(+incomeValue[currentYear], +baDegreeValue[currentYear]);
    });
}

/**
 *
 * @param incomeValue
 * @param baDegreeValue
 * @param x
 * @param y
 * @param n
 */
export function getColor(incomeValue: number, baDegreeValue: number) {
  if (!incomeValue || !baDegreeValue) return "#000";
  return colorGrid[y(incomeValue)][x(baDegreeValue)];
}

/**
 *
 */
export async function getBaDegreeData(): Promise<BaDegreeData[]> {
  return d3.csv("/data/usa_ba-degree-or-higher_2006-2019.csv", (row) => {
    return row as BaDegreeData;
  });
}

/**
 *
 */
export async function getIncomeData(): Promise<IncomeData[]> {
  return d3.csv("/data/usa_personal-income-by-state_2006-2019.csv", (row) => {
    return row as IncomeData;
  });
}
