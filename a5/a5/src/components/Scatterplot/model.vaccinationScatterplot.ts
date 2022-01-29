import * as d3 from "d3";
import {
  getVaccinationScatterPlotData,
  PositiveRate,
  VaccinationPerPopulation,
} from "../../utils/utils.vaccinationAggregation";
import { addAxes, getAxes, getScale } from "./model.weightScatterplot";

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
    .attr("width", width - margin * 3)
    .attr("id", "vaccination-plot")
    .attr("transform", "translate(" + margin * 2 + "," + margin + ")");
}

/**
 *
 * @param height
 * @param width
 * @param year
 * @param location
 */
export async function initVaccinationScatterPlot(
  height: number,
  width: number,
  year = 2022,
  location?: string
) {
  initScatterPlotContainer(height, width);
  const svg = d3.select("#vaccination-plot");
  const { newVaccinationsPerPopulation, positiveRateData, scatterPlotData } =
    await getVaccinationScatterPlotData(year);

  const [xScale, yScale] = createScales(
    height,
    width,
    newVaccinationsPerPopulation,
    positiveRateData
  );
  const [xAxis, yAxis] = getAxes(xScale, yScale);
  addAxes(svg, height, xAxis, yAxis);
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
  const yScale = getScale(
    [minPositiveRate, maxPositiveRate],
    [height - margin * 2, 0]
  );

  const minNewCasesPerPopulation = 0;

  const maxNewCasesPopulation = Math.max(
    ...newVaccinationsPerPopulation.map((d) => d.newVaccinationsPerPopulation)
  );

  const xScale = getScale(
    [minNewCasesPerPopulation, maxNewCasesPopulation],
    [0, width - margin * 3]
  );

  return [xScale, yScale];
}
