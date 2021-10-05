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
const margin = 60;
const height = 500 - margin*2;
const width = 1000 - margin*2;
const svgElement = d3.select("#bar-chart").append("g").attr("transform", `translate(${margin}, ${margin})`);

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
 * @param callback
 * @returns {Promise<*>}
 */
async function calculateScale(range, callback) {
    const data = await getData();
    return d3.scaleBand()
        .range(range)
        .domain(callback(data))
        .padding(0.2);
}

/**
 * Y Axis
 */
calculateScale([height, 0], (data) => [...data.map(d => d[Props.gdp]), "0"].sort((a, b) => a - b))
    .then(scale => svgElement.append("g").call(d3.axisLeft(scale)))

/**
 * X Axis
 */
calculateScale([0,width], (data) => data.map(d => d[Props.state]))
    .then(scale => svgElement.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(scale)));
