import * as d3 from "d3";
import {
  getVaccinationScatterPlotData,
  PositiveRate,
  VaccinationPerPopulation,
} from "../../utils/utils.vaccinationAggregation";
import {
  addAxes,
  addLabels,
  getAxes,
  getScale,
  updateAxes,
} from "./model.weightScatterplot";
import { DataSetType } from "../../types/type.dataset";

const margin = 20;

/**
 *
 * @param height
 * @param width
 */
function initScatterPlotContainer(height: number, width: number) {
  d3.select(`#vaccination-scatter-plot`)
    .append("g")
    .attr("height", height - margin * 2)
    .attr("width", width - margin * 2)
    .attr("id", "vaccination-plot")
    .attr("transform", "translate(" + margin * 2.6 + "," + margin + ")");
}

/**
 *
 * @param height
 * @param width
 * @param data
 * @param year
 * @param location
 */
export async function initVaccinationScatterPlot(
  height: number,
  width: number,
  data: DataSetType[],
  year = 2022,
  location?: string
) {
  initScatterPlotContainer(height, width);
  const svg = d3.select("#vaccination-plot");
  const { newVaccinationsPerPopulation, positiveRateData, scatterPlotData } =
    await getVaccinationScatterPlotData(data, year);

  const [xScale, yScale] = createScales(
    height,
    width,
    newVaccinationsPerPopulation,
    positiveRateData
  );

  const [xAxis, yAxis] = getAxes(xScale, yScale);
  addAxes(svg, height, xAxis, yAxis);
  addLabels(svg, height, width, "Vaccination/Population", "Positive Rate");

  svg
    .append("g")
    .attr("id", "data-points")
    .selectAll("dot")
    .data(scatterPlotData)
    .enter()
    .append("circle")
    .attr("z-index", 1)
    .attr("cx", (d) => xScale(d!.positiveRate))
    .attr("cy", (d) => yScale(d!.newVaccinationsPerPopulation))
    .attr("r", 5)
    .attr("fill", "black");

  addHoverEffect(svg, scatterPlotData);
}

/**
 *
 * @param height
 * @param width
 * @param data
 * @param year
 * @param location
 */
export function updateVaccinationScatterPlot(
  height: number,
  width: number,
  data: DataSetType[],
  year = 2022,
  location: string
) {
  const svg = d3.select("#vaccination-plot");
  const { newVaccinationsPerPopulation, positiveRateData, scatterPlotData } =
    getVaccinationScatterPlotData(data, year);

  const [xScale, yScale] = createScales(
    height,
    width,
    newVaccinationsPerPopulation,
    positiveRateData
  );
  const [xAxis, yAxis] = getAxes(xScale, yScale);
  updateAxes(svg, xAxis, yAxis);

  svg.select("#data-points").selectAll("circle").remove();

  svg
    .select("#data-points")
    .selectAll("circle")
    .data(scatterPlotData)
    .enter()
    .append("circle")
    .transition()
    .duration(1000)
    .attr("cx", (d) => xScale(d!.positiveRate))
    .attr("cy", (d) => yScale(d!.newVaccinationsPerPopulation))
    .attr("r", 5)
    .attr("fill", (d) => {
      if (d?.location === location) {
        return "#ff5724";
      }
      return "black";
    });

  addHoverEffect(svg, scatterPlotData, location);
}

/**
 *
 * @param height
 * @param width
 * @param newVaccinationsPerPopulation
 * @param positiveRateData
 */
function createScales(
  height: number,
  width: number,
  newVaccinationsPerPopulation: VaccinationPerPopulation[],
  positiveRateData: PositiveRate[]
) {
  const minPositiveRate = 0;
  const maxPositiveRate = Math.max(
    ...positiveRateData.map((d) => d.positiveRate)
  );

  const xScale = getScale(
    [minPositiveRate, maxPositiveRate],
    [0, width - margin * 3]
  );

  const minNewVaccinationsPerPopulation = 0;

  const maxNewVaccinationsPerPopulation = Math.max(
    ...newVaccinationsPerPopulation.map((d) => d.newVaccinationsPerPopulation)
  );

  const yScale = getScale(
    [minNewVaccinationsPerPopulation, maxNewVaccinationsPerPopulation],
    [height - margin * 2, 0]
  );

  return [xScale, yScale];
}

/**
 *
 * @param svg
 * @param scatterPlotData
 * @param location
 */
function addHoverEffect(
  svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
  scatterPlotData: (null | {
    positiveRate: number;
    location: string;
    newVaccinationsPerPopulation: number;
  })[],
  location?: string
) {
  svg
    .select("#data-points")
    .selectAll("circle")
    .data(scatterPlotData)
    .on("mouseover", function (event, data) {
      d3.select(this).style("fill", "#ff5724");
      d3.select("#vaccination-scatter-tooltip")
        .style("display", "block")
        .style("opacity", 1)
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY + "px")
        .html(
          `State: ${data?.location} <br /> New-Vaccinations/Populatin: ${data?.newVaccinationsPerPopulation} <br /> Positiverate: ${data?.positiveRate}`
        );
    })
    .on("mouseout", function (event, data) {
      if (location !== data?.location) {
        d3.select(this).style("fill", "black");
      }
      d3.select("#vaccination-scatter-tooltip")
        .style("opacity", "0")
        .style("left", "-1000px");
    });
}
