import * as d3 from "d3";
import { BaDegreeData, GeoData, IncomeData } from "./types/type.choroplethMap";
import { GeoProjection } from "d3";

export const colors = [
  "#eaede8",
  "#dd97e8",
  "#c811e8",
  "#b1ede8",
  "#b197e9",
  "#b111e9",
  "#07ede8",
  "#0797ea",
  "#0711ea",
];

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
  const n = Math.floor(Math.sqrt(colors.length));
  const x = d3.scaleQuantile(
    baDegreeData.map((d) => d[currentYear] as number),
    d3.range(n)
  );
  const y = d3.scaleQuantile(
    incomeData.map((d) => d[currentYear] as number),
    d3.range(n)
  );

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

      return getColor(
        incomeValue[currentYear] as number,
        baDegreeValue[currentYear] as number,
        x,
        y,
        n
      );
    });
}

/**
 * Logik of this function taken from https://observablehq.com/@d3/bivariate-choropleth [colors]
 *
 * @param incomeValue
 * @param baDegreeValue
 * @param x
 * @param y
 * @param n
 */
export function getColor(
  incomeValue: number,
  baDegreeValue: number,
  x: any,
  y: any,
  n: number
) {
  if (!incomeValue || !baDegreeValue) return "#000";
  return colors[x(baDegreeValue) + y(incomeValue) * n];
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
