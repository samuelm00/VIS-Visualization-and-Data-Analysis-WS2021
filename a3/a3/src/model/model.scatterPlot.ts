import * as d3 from "d3";
import {
  colorGrid,
  colors,
  getBaDegreeData,
  getIncomeData,
} from "./model.choroplethMap";
import { BaDegreeData, IncomeData } from "./types/type.choroplethMap";
import { Axis, ScaleLinear } from "d3";

export const margin = 40;

/**
 *
 * @param plotId
 * @param currentYear
 * @param height
 * @param width
 * @param setSelectedBrushPoints
 */
export async function createScatterPlot(
  plotId: string,
  currentYear: string,
  height: number,
  width: number,
  setSelectedBrushPoints: React.Dispatch<React.SetStateAction<string[]>>
) {
  const svg = d3.select(`#${plotId}`);
  if (!svg) return;
  const baDegreeData = await getBaDegreeData();
  const incomeData = await getIncomeData();
  const [xScale, yScale] = createScales(
    baDegreeData,
    currentYear,
    incomeData,
    width,
    height
  );

  // Add y and x - Axes
  const [xAxis, yAxis] = getAxes(xScale, yScale);
  addAxes(svg, height, xAxis, yAxis);

  const data = baDegreeData.map((d, index) => ({
    name: d.State,
    baDegree: +d[currentYear] as number,
    income: +incomeData[index][currentYear] as number,
  }));

  // Add the color grid to the background of the svg
  addColorGrid(plotId, [height, width]);

  const brush = d3
    .brush()
    .extent([
      [0, 0],
      [width - margin * 2, height - margin],
    ])
    .on("brush", (event) =>
      handleBrushing(event, currentYear, setSelectedBrushPoints)
    )
    .on("end", ({ selection }) => {
      handleBrushEnd(setSelectedBrushPoints, selection);
    });
  svg.append("g").attr("id", "brush").call(brush);

  svg
    .append("g")
    .attr("id", "data-points")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return xScale(d.baDegree);
    })
    .attr("cy", function (d) {
      return yScale(d.income);
    })
    .attr("r", 3)
    .style("fill", (d) => "black")
    .on("mouseover", function (event, data) {
      d3.select(this).style("fill", "red");
      d3.select("#scatter-tooltip")
        .style("display", "block")
        .style("opacity", 1)
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY + "px")
        .html(
          `State: ${data.name} <br /> Income: ${data.income} <br /> Ba Degrees: ${data.baDegree}`
        );
    })
    .on("mouseout", function (event, { name }) {
      if (!d3.select(this).attr("class")?.includes("circle-selected")) {
        d3.select(this).style("fill", "black");
      }
      d3.select("#scatter-tooltip")
        .style("opacity", "0")
        .style("left", "-1000px");
    });

  addAxisLabels(svg, height, width);
}

/**
 *
 * @param plotId
 * @param currentYear
 * @param height
 * @param width
 */
export async function updateScatterPlot(
  plotId: string,
  currentYear: string,
  height: number,
  width: number
) {
  const baDegreeData = await getBaDegreeData();
  const incomeData = await getIncomeData();
  const svg = d3.select(`#${plotId}`);
  const data = baDegreeData.map((d, index) => ({
    name: baDegreeData[index].State,
    baDegree: +d[currentYear] as number,
    income: +incomeData[index][currentYear] as number,
  }));
  const [xScale, yScale] = createScales(
    baDegreeData,
    currentYear,
    incomeData,
    width,
    height
  );

  const [xAxis, yAxis] = getAxes(xScale, yScale);

  svg
    .selectAll("#xAxis")
    .transition()
    .duration(200)
    // @ts-ignore
    .call(xAxis);
  svg
    .selectAll("#yAxis")
    .transition()
    .duration(200)
    // @ts-ignore
    .call(yAxis);

  svg
    .selectAll("circle")
    .data(data)
    .transition()
    .duration(1000)
    .attr("cx", function (d) {
      return xScale(d.baDegree);
    })
    .attr("cy", function (d) {
      return yScale(d.income);
    });
}

/**
 *
 * @param xScale
 * @param yScale
 */
function getAxes(
  xScale: ScaleLinear<number, number, never>,
  yScale: ScaleLinear<number, number, never>
) {
  const xAxis = d3
    .axisBottom(xScale)
    .tickFormat((d) => {
      return `${d}%`;
    })
    .ticks(6);
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.format("$.2s")).ticks(6);
  return [xAxis, yAxis];
}

/**
 *
 * @param svg
 * @param height
 * @param xAxis
 * @param yAxis
 */
function addAxes(
  svg: any,
  height: number,
  xAxis: Axis<number | { valueOf(): number }>,
  yAxis: Axis<number | { valueOf(): number }>
) {
  svg
    .append("g")
    .attr("transform", "translate(0," + (height - margin) + ")")
    .attr("id", "xAxis")
    .call(xAxis);
  svg.append("g").attr("id", "yAxis").call(yAxis);
}

/**
 *
 * @param svg
 * @param height
 * @param width
 */
function addAxisLabels(svg: any, height: number, width: number) {
  svg
    .append("text")
    .attr("x", -(height / 2))
    .attr("y", -60)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .attr("class", "font-bold")
    .text("Average personal yearly income");

  svg
    .append("text")
    .attr("x", width / 2 - margin)
    .attr("y", height)
    .attr("text-anchor", "middle")
    .attr("class", "text-sm font-bold")
    .text("Educational attainment rate (bachelor or higher)");
}

/**
 *
 * @param event
 * @param currentYear
 * @param setSelectedBrushPoints
 */
function handleBrushing(
  event: any,
  currentYear: string,
  setSelectedBrushPoints: React.Dispatch<React.SetStateAction<string[]>>
) {
  const selection = event.selection;
  let selected: string[] = [];
  d3.select("#data-points")
    .selectAll("circle")
    .style("fill", function (d: any) {
      const cx = +d3.select(this).attr("cx");
      const cy = +d3.select(this).attr("cy");
      if (isSelected(selection, cx, cy)) {
        selected = Array.from(new Set([...selected, d.name]));
        d3.select(this).classed("circle-selected", true);
        return "red";
      } else {
        selected.filter((name) => name !== d.name);
        d3.select(this).classed("circle-selected", false);
        return "black";
      }
    });
  setSelectedBrushPoints(selected);
}

/**
 *
 * @param selectedBrushPoints
 */
export function updateCircles(selectedBrushPoints: string[]) {
  d3.select("#data-points")
    .selectAll("circle")
    .style("fill", function (d: any) {
      if (selectedBrushPoints.includes(d.name)) {
        return "red";
      } else {
        return "black";
      }
    });
}

/**
 *
 * @param coordinates
 * @param x
 * @param y
 */
function isSelected(coordinates: number[][], x: number, y: number) {
  return (
    coordinates[0][0] <= x &&
    x <= coordinates[1][0] &&
    coordinates[0][1] <= y &&
    y <= coordinates[1][1]
  );
}

/**
 *
 * @param selection
 * @param setSelectedBrushPoints
 */
function handleBrushEnd(
  setSelectedBrushPoints: React.Dispatch<React.SetStateAction<string[]>>,
  selection?: number[][]
) {
  if (!selection) {
    setSelectedBrushPoints([]);
    d3.select("#data-points")
      .selectAll("circle")
      .style("fill", (d: any) => {
        return "black";
      });
  }
}

/**
 *
 * @param plotId
 * @param svgSize
 */
function addColorGrid(plotId: string, svgSize: [number, number]) {
  const size = Math.floor(Math.sqrt(colors.length));
  const [height, width] = svgSize;
  const svg = d3.select(`#${plotId}`);
  const range = d3.range(size);
  const baseGrid = d3.cross(range, range);
  svg
    .append("g")
    .selectAll("rect")
    .data(baseGrid)
    .enter()
    .append("rect")
    .attr("height", (height - margin) / size)
    .attr("width", (width - margin * 2) / size)
    .attr("x", ([x]) => (x * (width - margin * 2)) / size)
    .attr("y", ([, y]) => ((size - 1 - y) * (height - margin)) / size)
    .attr("fill", ([x, y]) => getColor(x, y, size));
}

/**
 *
 * @param baDegreeData
 * @param currentYear
 * @param width
 * @param incomeData
 * @param height
 */
function createScales(
  baDegreeData: BaDegreeData[],
  currentYear: string,
  incomeData: IncomeData[],
  width: number,
  height: number
) {
  const baData = baDegreeData.map((d) => +d[currentYear]);
  const maxBa = Math.max(...baData);
  const minBa = Math.min(...baData);
  const xScale = getScale([minBa, maxBa], [0, width - margin * 2]);

  const icData = incomeData.map((d) => +d[currentYear]);
  const incomeMin = Math.min(...icData);
  const incomeMax = Math.max(...icData);
  const yScale = getScale([incomeMin, incomeMax], [height - margin, 0]);

  return [xScale, yScale];
}

/**
 *
 * @param domain
 * @param range
 */
function getScale(domain: number[], range: number[]) {
  return d3.scaleLinear().domain(domain).range(range);
}

/**
 *
 * @param x
 * @param y
 * @param n
 */
export function getColor(x: number, y: number, n: number) {
  return colorGrid[y][x];
}
