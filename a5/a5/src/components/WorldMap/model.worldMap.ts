import {
  select,
  json,
  geoPath,
  geoEquirectangular,
  range,
  scaleThreshold,
  ScaleThreshold,
} from "d3";
import { DataSetType } from "../../types/type.dataset";
import { getDatasetsForWeightedScatterPlot } from "../../utils/utils.weightedAggregation";
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

const locationsNotCaptured = [
  {
    name: "USA",
    value: "United States",
  },
  {
    name: "Republic of Serbia",
    value: "Serbia",
  },
  {
    name: "Democratic Republic of the Congo",
    value: "Congo",
  },
  {
    name: "Republic of the Congo",
    value: "Congo",
  },
  {
    name: "The Bahamas",
    value: "Bahamas",
  },
  {
    name: "United Republic of Tanzania",
    value: "Tanzania",
  },
  {
    name: "England",
    value: "United Kingdom",
  },
  {
    name: "Czech Republic",
    value: "Czechia",
  },
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
  const { scatterPlotData } = getDatasetsForWeightedScatterPlot(
    year,
    dataSet,
    weights,
    percentages,
    category
  );

  const [xDomain, yDomain] = getThresholdDomain(
    weights,
    scatterPlotData,
    category
  );
  const xColor = scaleThreshold().domain(xDomain).range(range(n));
  const yColor = scaleThreshold().domain(yDomain).range(range(n));

  svg
    .append("g")
    .selectAll("path")
    .data(geoData.features as any[])
    .enter()
    .append("path")
    .attr("d", path)
    .attr("stroke", "#3d4451")
    .attr("fill", (d) => {
      return getFillColor(scatterPlotData, d, xColor, yColor);
    })
    .on("mouseover", function (event, data) {
      const value = scatterPlotData.find(
        (c) => c!.location.toLowerCase() === data.properties.name.toLowerCase()
      );
      select(this).attr("fill", "#ff5724");
      select("#world-map-tooltip")
        .style("display", "block")
        .style("opacity", 1)
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY + "px")
        .html(
          `State: ${data.properties.name} <br> Cases-per-population: ${
            value?.casesPerPopulation || "NO DATA"
          } <br> Weight: ${value?.weight || "NO DATA"}`
        );
    })
    .on("mouseout", function (_, d) {
      const color = getFillColor(scatterPlotData, d, xColor, yColor);
      select(this).attr("fill", color);
      select("#world-map-tooltip")
        .style("opacity", "0")
        .style("left", "-1000px");
    });
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
export async function updateWorldMap(
  height: number,
  width: number,
  dataSet: DataSetType[],
  year: number,
  weights: AggregationProps,
  percentages: AggregationProps,
  category: AggregationCategory
) {
  const svg = select("#world-map");
  const geoData: any = await json(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
  );

  const { scatterPlotData } = getDatasetsForWeightedScatterPlot(
    year,
    dataSet,
    weights,
    percentages,
    category
  );

  const [xDomain, yDomain] = getThresholdDomain(
    weights,
    scatterPlotData,
    category
  );
  const xColor = scaleThreshold().domain(xDomain).range(range(n));
  const yColor = scaleThreshold().domain(yDomain).range(range(n));

  svg
    .selectAll("path")
    .data(geoData.features as any[])
    .transition()
    .duration(200)
    .attr("fill", (d) => {
      return getFillColor(scatterPlotData, d, xColor, yColor);
    });

  svg
    .selectAll("path")
    .data(geoData.features as any[])
    .on("mouseover", function (event, data) {
      const value = scatterPlotData.find(
        (c) => c!.location.toLowerCase() === data.properties.name.toLowerCase()
      );
      select(this).attr("fill", "#ff5724");
      select("#world-map-tooltip")
        .style("display", "block")
        .style("opacity", 1)
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY + "px")
        .html(
          `State: ${data.properties.name} <br> Cases-per-population: ${
            value?.casesPerPopulation || "NO DATA"
          } <br> Weight: ${value?.weight || "NO DATA"}`
        );
    });
}

/**
 *
 * @param scatterPlotData
 * @param d
 * @param xColor
 * @param yColor
 */
function getFillColor(
  scatterPlotData: ({
    casesPerPopulation: number;
    weight: number;
    location: string;
  } | null)[],
  d: any,
  xColor: ScaleThreshold<number, number, never>,
  yColor: ScaleThreshold<number, number, never>
) {
  const value = scatterPlotData.find((c) => {
    const notCapturedValue = locationsNotCaptured.find(
      (loc) => loc.name === d.properties.name
    );
    const name = notCapturedValue ? notCapturedValue.value : d.properties.name;
    return c!.location.toLowerCase() === name.toLowerCase();
  });
  if (value) {
    const x = xColor(value.casesPerPopulation);
    const y = yColor(value.weight);
    return getColor(x, y);
  }
  return "black";
}

/**
 *
 * @param weights
 * @param data
 * @param category
 */
function getThresholdDomain(
  weights: AggregationProps,
  data: ({
    location: string;
    weight: number;
    casesPerPopulation: number;
  } | null)[],
  category: AggregationCategory
) {
  const weightArr = Object.values(weights[category]);
  const minWeight = 0;
  const maxWeight = weightArr.reduce((a, b) => a + b);

  const minCasesPerPopulation = 0;
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
  return [x, y];
}
