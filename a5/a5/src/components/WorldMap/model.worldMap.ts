import {
  select,
  json,
  geoPath,
  geoEquirectangular,
  range,
  scaleThreshold,
} from "d3";
import { DataSetType } from "../../types/type.dataset";
import {
  CasesPerPopulationData,
  getDatasetsForWeightedScatterPlot,
} from "../../utils/utils.weightedAggregation";
import { AggregationProps } from "../CustomAggregator/CustomAggregetor";
import { AggregationCategory } from "../../provider/AggregationFilterProvider";

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

export function getColor(x: number, y: number) {
  return colorGrid[x][y];
}

/**
 *
 * @param height
 * @param width
 * @param dataSet
 * @param year
 * @param weights
 * @param percentages
 * @param category
 */
export async function initWorldMap(
  height: number,
  width: number,
  dataSet: DataSetType[],
  year: number,
  weights: AggregationProps,
  percentages: AggregationProps,
  category: AggregationCategory
) {
  const svg = select("#world-map");
  const projection = geoEquirectangular().fitSize([width, height], {
    type: "Sphere",
    coordinates: [0, 0],
  });
  const path = geoPath().projection(projection);

  const geoData: any = await json(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
  );
  const { totalCasesPerPopulation, scatterPlotData } =
    getDatasetsForWeightedScatterPlot(
      year,
      dataSet,
      weights,
      percentages,
      category
    );

  const [xDomain, yDomain] = getThresholdDomain(scatterPlotData);
  const xColor = scaleThreshold().domain(xDomain).range(range(n));
  const yColor = scaleThreshold().domain(yDomain).range(range(n));

  //const countryName = feature.properties.name.toLowerCase();

  svg
    .append("g")
    .selectAll("path")
    .data(geoData.features as any[])
    .enter()
    .append("path")
    .attr("d", path)
    .attr("stroke", "#3d4451")
    .attr("fill", (d) => {
      const value = scatterPlotData.find(
        (c) => c!.location.toLowerCase() === d.properties.name.toLowerCase()
      );
      if (value) {
        const x = xColor(value.casesPerPopulation);
        const y = yColor(value.casesPerPopulation);
        return getColor(x, y);
      }
      console.log("no value for", d.properties.name);
      return "black";
    })
    .on("mouseover", function (event, data) {
      select(this).attr("fill", "#ff5724");
      select("#world-map-tooltip")
        .style("display", "block")
        .style("opacity", 1)
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY + "px")
        .html(`State: ${data.properties.name}`);
    })
    .on("mouseout", function (_, d) {
      let color = "black";
      const value = scatterPlotData.find(
        (c) => c!.location.toLowerCase() === d.properties.name.toLowerCase()
      );
      if (value) {
        const x = xColor(value.casesPerPopulation);
        const y = yColor(value.casesPerPopulation);
        color = getColor(x, y);
      }
      select(this).attr("fill", color);
      select("#world-map-tooltip")
        .style("opacity", "0")
        .style("left", "-1000px");
    });
}

/**
 *
 * @param data
 */
function getThresholdDomain(
  data: ({
    location: string;
    weight: number;
    casesPerPopulation: number;
  } | null)[]
) {
  const minWeight = Math.min(...data.map((d) => d!.weight));
  const maxWeight = Math.max(...data.map((d) => d!.weight));
  const minCasesPerPopulation = Math.min(
    ...data.map((d) => d!.casesPerPopulation)
  );
  const maxCasesPerPopulation = Math.max(
    ...data.map((d) => d!.casesPerPopulation)
  );

  const x = [];
  const y = [];

  for (let i = 1; i < 3; ++i) {
    y.push(minWeight + i * ((maxWeight - minWeight) / 3));
    x.push(
      minCasesPerPopulation +
        i * ((maxCasesPerPopulation - minCasesPerPopulation) / 3)
    );
  }
  return [y, x];
}
