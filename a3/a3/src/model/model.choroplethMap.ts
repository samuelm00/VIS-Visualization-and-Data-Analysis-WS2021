import * as d3 from "d3";
import { BaDegreeData, GeoData, IncomeData } from "./types/type.choroplethMap";
import { GeoProjection } from "d3";
import React from "react";

export const colors = [
  "#e6e6e6",
  "#96d9d9",
  "#2dc9c9",
  "#a3c7ce",
  "#6bbdc3",
  "#20afb4",
  "#60a9b5",
  "#3fa0ac",
  "#13949f",
];

export const colorGrid = [
  colors.slice(0, 3),
  colors.slice(3, 6),
  colors.slice(6, 9),
];

const n = Math.floor(Math.sqrt(colors.length));

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
 * @param setSelectedBrushPoints
 */
export async function createMap(
  svgId: string,
  currentYear: string,
  setSelectedBrushPoints: React.Dispatch<React.SetStateAction<string[]>>
) {
  const svg = d3.select(`#${svgId}`);
  if (!svg) return;
  const baDegreeData = await getBaDegreeData();
  const incomeData = await getIncomeData();
  const geoData = await getGeoData();
  const projection = await basicMap(+svg.attr("height"), +svg.attr("width"));

  const [yDomain, xDomain] = getThresholdDomain(
    baDegreeData,
    incomeData,
    currentYear
  );
  const x = d3.scaleThreshold().domain(xDomain).range(d3.range(n));
  const y = d3.scaleThreshold().domain(yDomain).range(d3.range(n));

  // draw the map
  svg
    .append("g")
    .selectAll("path")
    .data(geoData.features)
    .enter()
    .append("path")
    .attr("d", d3.geoPath().projection(projection))
    .attr("stroke", "gray")
    .attr("fill", (d) => {
      const baDegreeValue = baDegreeData.find(
        (x) => x.State === d.properties.name
      );
      const incomeValue = incomeData.find((x) => x.State === d.properties.name);

      if (!incomeValue || !baDegreeValue) return "white";

      return getColor(
        x(+incomeValue[currentYear]),
        y(+baDegreeValue[currentYear])
      );
    })
    .on("mouseover", function (event, data) {
      d3.select("#map-tooltip")
        .style("display", "block")
        .style("opacity", 1)
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY + "px")
        .html(`State: ${data.properties.name}`);
    })
    .on("mouseout", function () {
      d3.select("#map-tooltip").style("opacity", "0").style("left", "-1000px");
    })
    .on("click", function (event, data) {
      setSelectedBrushPoints((prev) => {
        if (prev.includes(data.properties.name)) {
          return prev.filter((x) => x !== data.properties.name);
        } else {
          return [...prev, data.properties.name];
        }
      });
    });
}

/**
 *
 * @param svgId
 * @param currentYear
 * @param selectedBrushPoints
 */
export async function updateMap(
  svgId: string,
  currentYear: string,
  selectedBrushPoints: string[]
) {
  const svg = d3.select(`#${svgId}`);
  if (!svg) return;
  const baDegreeData = await getBaDegreeData();
  const incomeData = await getIncomeData();
  const geoData = await getGeoData();

  const [yDomain, xDomain] = getThresholdDomain(
    baDegreeData,
    incomeData,
    currentYear
  );
  const x = d3.scaleThreshold().domain(xDomain).range(d3.range(n));
  const y = d3.scaleThreshold().domain(yDomain).range(d3.range(n));

  // draw the map
  svg
    .selectAll("path")
    .data(geoData.features)
    .transition()
    .duration(200)
    .attr("fill", (d) => {
      const baDegreeValue = baDegreeData.find(
        (x) => x.State === d.properties.name
      );
      const incomeValue = incomeData.find((x) => x.State === d.properties.name);

      if (!incomeValue || !baDegreeValue) return "white";

      if (selectedBrushPoints.length) {
        if (selectedBrushPoints.includes(d.properties.name)) {
          return getColor(
            x(+incomeValue[currentYear]),
            y(+baDegreeValue[currentYear])
          );
        }
        return "white";
      }

      return getColor(
        x(+incomeValue[currentYear]),
        y(+baDegreeValue[currentYear])
      );
    });
}

/**
 *
 * @param baDegreeData
 * @param incomeData
 * @param currentYear
 */
function getThresholdDomain(
  baDegreeData: BaDegreeData[],
  incomeData: IncomeData[],
  currentYear: string
) {
  const baData = baDegreeData.map((d) => +d[currentYear]);
  const minBa = Math.min(...baData);
  const maxBa = Math.max(...baData);
  const icData = incomeData.map((d) => +d[currentYear]);
  const minIncome = Math.min(...icData);
  const maxIncome = Math.max(...icData);
  const y = [];
  const x = [];
  for (let i = 1; i < 3; ++i) {
    y.push(minBa + i * ((maxBa - minBa) / 3));
    x.push(minIncome + i * ((maxIncome - minIncome) / 3));
  }
  return [y, x];
}

/**
 *
 * @param x
 * @param y
 */
export function getColor(x: number, y: number) {
  return colorGrid[x][y];
}

const BASE = "/~samuelm00/VIS21W/A3";

/**
 *
 */
async function getGeoData() {
  return (await d3.json(`${BASE}/data/us-states-geo.json`)) as GeoData;
}

/**
 *
 */
export async function getBaDegreeData(): Promise<BaDegreeData[]> {
  return d3.csv(`${BASE}/data/usa_ba-degree-or-higher_2006-2019.csv`, (row) => {
    return row as BaDegreeData;
  });
}

/**
 *
 */
export async function getIncomeData(): Promise<IncomeData[]> {
  return d3.csv(
    `${BASE}/data/usa_personal-income-by-state_2006-2019.csv`,
    (row) => {
      return row as IncomeData;
    }
  );
}
