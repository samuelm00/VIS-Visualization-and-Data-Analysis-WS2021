import * as d3 from "d3";
import {
  BarchartData,
  getBarchartData,
} from "../../utils/utils.barchartAggregation";

const margin = 20;
const fields: (keyof BarchartData)[] = ["newCases", "newVaccinations"];

/**
 *
 * @param height
 * @param width
 */
function initBarchartContainer(height: number, width: number) {
  const svgElement = d3.select("#barchart");
  return svgElement
    .append("g")
    .attr("transform", `translate(${margin * 3}, -${margin - 10})`);
}

/**
 *
 * @param height
 * @param width
 * @param year
 */
export async function initBarchart(height: number, width: number, year = 2020) {
  const svg = initBarchartContainer(height, width);

  const data = await getBarchartData(year);
  const sortedData = data
    .sort(
      (a, b) =>
        b.newVaccinations + b.newCases - (a.newVaccinations + a.newCases)
    )
    .slice(0, 30);

  const [xAxisNames, xAxisFields, yAxis] = createScales(
    height,
    width,
    sortedData
  );
  addAxes(svg, height, xAxisNames, yAxis);
  addYLabel(svg, height);

  svg
    .append("g")
    .selectAll("g")
    .data(sortedData)
    .enter()
    .append("g")
    .attr("transform", (d) => {
      return "translate(" + xAxisNames(d.location) + ",-200)";
    })
    .selectAll("rect")
    .data((d) =>
      fields.map((key) => ({
        key: key,
        value: d[key] as number,
        location: d.location,
      }))
    )
    .enter()
    .append("rect")
    .attr("x", (d) => xAxisFields(d.key) || 0)
    .attr("y", (d) => yAxis(d.value))
    .attr("height", (d) => height - yAxis(d.value))
    .attr("fill", (d) => (d.key === "newVaccinations" ? "#ff5724" : "#009485"))
    .attr("width", () => xAxisFields.bandwidth())
    .on("mouseover", function (event, data) {
      d3.select(this).style("fill", "white");
      d3.select("#barchart-tooltip")
        .style("display", "block")
        .style("opacity", 1)
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY + "px")
        .html(`Location: ${data?.location} <br /> ${data.key}: ${data?.value}`);
    })
    .on("mouseout", function (event, data) {
      d3.select(this).style(
        "fill",
        data.key === "newVaccinations" ? "#ff5724" : "#009485"
      );
      d3.select("#barchart-tooltip")
        .style("opacity", "0")
        .style("left", "-1000px");
    });
}

/**
 *
 * @param height
 * @param width
 * @param data
 */
function createScales(
  height: number,
  width: number,
  data: BarchartData[]
): [
  d3.ScaleBand<string>,
  d3.ScaleBand<string>,
  d3.ScaleLinear<number, number, never>
] {
  const xScaleGroup = d3
    .scaleBand()
    .domain(data.map((d) => d.location))
    .range([0, width - margin * 3])
    .padding(0.1);

  const xScale = d3
    .scaleBand()
    .domain(fields)
    .range([0, xScaleGroup.bandwidth()]);

  const maxVaccinations = Math.max(...data.map((d) => d.newVaccinations));
  const maxCases = Math.max(...data.map((d) => d.newCases));

  const yScale = d3
    .scaleLinear()
    .domain([0, Math.max(maxVaccinations, maxCases)])
    .range([height - 200, 0]);

  return [xScaleGroup, xScale, yScale];
}

/**
 *
 * @param svg
 * @param height
 * @param xAxis
 * @param yAxis
 */
function addAxes(svg: any, height: number, xAxis: any, yAxis: any) {
  svg
    .append("g")
    .attr("transform", `translate(0, ${height - 200})`)
    .call(d3.axisBottom(xAxis))
    // code to rotate the labels from: https://stackoverflow.com/questions/20947488/d3-grouped-bar-chart-how-to-rotate-the-text-of-x-axis-ticks
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");
  svg.append("g").call(d3.axisLeft(yAxis));
}

/**
 *
 * @param svg
 * @param height
 */
function addYLabel(svg: any, height: number) {
  svg
    .append("text")
    .attr("x", -(height / 2) + 200)
    .attr("y", -40)
    .attr("transform", "rotate(-90)")
    .style("fill", "white")
    .attr("text-anchor", "start")
    .attr("class", "text-xs")
    .text("Population per 100.000");
}
