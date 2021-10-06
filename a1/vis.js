/**
 * @type {{gdp: string, state: string}}
 */
const Props = {
    state: "State",
    gdp: "GDP"
}

/**
 * Basic sizes and Elements
 * @type {number}
 */
const margin = 100;
const height = 500 - margin*2;
const width = 1000 - margin*2;
const svgElement = d3.select("#bar-chart");
const barChart = svgElement.append("g").attr("transform", `translate(${margin}, ${margin})`);

/**
 *
 * @returns {Promise<*[]>}
 */
async function getData() {
    const d = [];
    await d3.csv("usa_nominal_gdp_top10_2021.csv", (rawData) => {
        d.push(rawData);
    })
    return d;
}

/**
 *
 * @param range
 * @param data
 * @param variant
 * @returns {Promise<*>}
 */
async function calculateScale(range, data, variant) {
    if (variant === "y")
        return d3.scaleLinear()
            .range(range)
            .domain([0, data[data.length-1]])

    return d3.scaleBand()
        .range(range)
        .domain(data)
        .padding(0.2);
}

/**
 *
 * @param data
 * @param xScale
 * @param yScale
 */
function drawCharts(data, xScale, yScale) {
    barChart.selectAll()
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d[Props.state]))
        .attr("y", d => yScale(d[Props.gdp]))
        .attr("height", d => height - yScale(d[Props.gdp]))
        .attr("width", d => xScale.bandwidth())
}

/**
 *
 */
(async function() {
    const data = await getData();

    /**
     * Y-Axis
     * @type {*}
     */
    const yScale = await calculateScale([height, 0], [...data.map(d => d[Props.gdp]), "0"].sort((a, b) => a - b), "y");
    barChart.append("g").call(d3.axisLeft(yScale))

    /**
     * X Axis
     * @type {*}
     */
    const xScale = await calculateScale([0,width],  data.map(d => d[Props.state]), "x");
    barChart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));

    /**
     * Draw Data
     */
    drawCharts(data, xScale, yScale);

    /**
     * Add Labels
     */
    svgElement.append("text")
        .attr("x", -(height / 2) - margin)
        .attr("y", 20)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Nominal GDP (millions of $)")

    svgElement.append('text')
        .attr("x", width / 2 + margin)
        .attr("y", 450)
        .attr("text-anchor", "middle")
        .text("States")
}());