/**
 *
 * @type {{state: string}}
 */
const Props = {
    state: "State"
}

/**
 *
 * @type {{color: string, active: string, id: string}}
 */
const ActiveObjectProps = {
    color: "color",
    id: "id",
    active: "active"
}

/**
 * Basic sizes and Elements
 * @type {number}
 */
const margin = 100;
const height = 800 - margin*2;
const heightBrush = 200 - margin * 2;
const width = 1000 - margin*2;
const svgElement = d3.select("#line-chart");
const brushSvg = d3.select("#brush");
const brushLineChart = d3.append("g").attr("transform", `translate(${margin}, ${margin})`);
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
function drawSingleLine(xAxis, yAxis, data, color) {
    lineChart.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 3)
        .attr("d", d3.line()
            .x(d => xAxis(new Date(d.year)))
            .y(d => yAxis(d.gdp))
        )
    }

function getRandomNumber(maxNr) {
    return Math.floor(Math.random() * maxNr);
}

/**
 *
 * @param xAxis
 * @param yAxis
 * @param data
 */
function drawLines(xAxis, yAxis, data) {
    data.forEach((d, i) => {
        const dataArr = Object
            .keys(d)
            .filter(key => key !== Props.state)
            .map(key => ({
                year: key,
                gdp: +d[key]
            }))
        drawSingleLine(xAxis, yAxis, dataArr,
            `rgb(${getRandomNumber(255)+i}, ${getRandomNumber(255)+i}, ${getRandomNumber(255)+i})`)
    })
}

/**
 *
 * @param activeObject
 * @param data
 * @returns {*}
 */
function getActiveObject(activeObject, data) {
    return activeObject.find(aO => aO[ActiveObjectProps.id] === data[Props.state])
}

/**
 *
 * @param event
 * @param data
 * @param activeObjects
 */
function onMouseOver(event, data, activeObjects) {
    const activeObject = getActiveObject(activeObjects, data)
    if (!activeObject) {
        // save current color and the name of the state as id
        activeObjects.push({
            [ActiveObjectProps.color]: d3.select(this).attr("stroke"),
            [ActiveObjectProps.id]: data[Props.state]
        })
    }

    // change color to black
    d3.select(this)
        .attr("stroke", "black")
        .attr("id", data[Props.state])

    // add text to the path
    lineChart.append("text")
        .append("textPath")
        .attr("xlink:href", `#${data[Props.state]}`)
        .attr("id", `${data[Props.state]}-text`)
        .attr("startOffset", "50%")
        .text(data[Props.state])
}

/**
 *
 * @param event
 * @param data
 * @param activeObjects
 */
function onMouseOut (event, data, activeObjects) {
    const activeObject = getActiveObject(activeObjects, data);
    if (!activeObject || !activeObject[ActiveObjectProps.active]) {
        // remove text from line chart
        lineChart.select(`#${data[Props.state]}-text`).remove()
        // remove black color and add the old one
        d3.select(this)
            .attr("stroke", activeObjects.find(aO => aO[ActiveObjectProps.id] === data[Props.state])[ActiveObjectProps.color])
            .attr("id", "")
        activeObjects = activeObjects.filter(aO => aO[ActiveObjectProps.id] !== data[Props.state])
    }
}

/**
 *
 * @param event
 * @param data
 * @param activeObjects
 */
function onClick (event, data, activeObjects) {
    const activeObject = getActiveObject(activeObjects, data);
    if (activeObject)  activeObject[ActiveObjectProps.active] = !activeObject[ActiveObjectProps.active];
}


(async function () {
   const data = await getData();
   let activeObjects = []

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
        .attr("y", 750)
        .attr("text-anchor", "middle")
        .text("Years")

    /**
     * Adding hover effekts
     */
    lineChart.selectAll("path")
        .data(data)
        .on("mouseover", e => onMouseOver(e, data, activeObjects))
        .on("mouseout", e => onMouseOut(e, data, activeObjects))
        .on("click", e => onClick(e, data, activeObjects))
}())