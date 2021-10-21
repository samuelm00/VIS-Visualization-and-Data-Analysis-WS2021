const Props = {
    state: "State"
}

/**
 * Basic sizes and Elements
 * @type {number}
 */
const margin = 100;
const height = 600 - margin*2;
const width = 1000 - margin*2;
const svgElement = d3.select("#line-chart");
const lineChart = svgElement.append("g").attr("transform", `translate(${margin}, ${margin})`);

/**
 *
 * @returns {Promise<*[]>}
 */
async function getData() {
    const d = [];
    await d3.csv("usa_nominal_gdp_1997-2020.csv", (rawData) => {
        d.push(rawData);
    })
    return d;
}

/**
 *
 * @param range
 * @param data
 * @param variant
 * @returns {*}
 */
function calculateScale(range, data, variant) {
    if (variant === "y") {
        return d3.scaleLinear().range(range).domain([0, data[data.length-1]])
    }
    return d3.scaleTime().range(range).domain([new Date("1997"), new Date("2020")]);
}

/**
 *
 * @param xAxis
 * @param yAxis
 * @param data
 */
function drawSingleLine(xAxis, yAxis, data) {
    lineChart.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 1)
        .attr("d", d3.line()
            .x(d => xAxis(new Date(d.year)))
            .y(d => yAxis(d.gdp))
        );
}

/**
 *
 * @param xAxis
 * @param yAxis
 * @param data
 */
function drawLines(xAxis, yAxis, data) {
    data.forEach(d => {
        const dataArr = Object
            .keys(d)
            .filter(key => key !== Props.state)
            .map(key => ({
                year: key,
                gdp: +d[key]
            }))
        drawSingleLine(xAxis, yAxis, dataArr)
    })
}

(async function () {
   const data = await getData();
    /**
     * Calculate scales
     * @type {*}
     */
    const xScale = calculateScale([0, width]);

    const yDomain = [].concat(...data.map(d =>
         Object
            .keys(d)
            .filter(key => key !== Props.state)
            .map(key => Math.round(+d[key]))
    )).sort((a,b) => a-b);

   const yScale = calculateScale([height, 0], yDomain, "y");

    /**
     * Add Axiss
     */
    lineChart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale))

    lineChart.append("g")
        .call(d3.axisLeft(yScale))

    /**
     * Draw Lines
     */
    drawLines(xScale, yScale, data)

}())