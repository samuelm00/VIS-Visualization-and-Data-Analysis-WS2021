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
const heightBrush = 400 - margin * 2;
const width = 1000 - margin*2;

// contains colors of lines
let colorArray = [];

// contains active lines
let activeObjects = []


const svgElement = d3.select("#line-chart");
const brushSvg = d3.select("#brush-svg");

const brushLineChart = brushSvg.append("g").attr("transform", `translate(${margin}, ${margin})`);
const lineChart = svgElement.append("g").attr("transform", `translate(${margin}, ${margin})`);

brushSvg.append("defs")
    .append("svg:clipPath")
    .attr("id", "clip")
    .append("svg:rect")
    .attr("width", width)
    .attr("height", heightBrush)
    .attr("x", 0)
    .attr("y", 0);

svgElement.append("defs")
    .append("svg:clipPath")
    .attr("id", "clip")
    .append("svg:rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0);

/**
 * Elements mark the area of the charts!
 * They avoid line overflow
 */
const brushArea = brushSvg
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`)
    .attr("clip-path", "url(#clip)")

const lineChartArea = lineChart
    .append("g")
    .attr("clip-path", "url(#clip)")


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
 * @param color
 * @param brush
 * @param state
 */
function drawSingleLine(xAxis, yAxis, data, color, brush, state) {
    const label = state.replace(" ", "-");
    (brush ? brushArea : lineChartArea).append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 3)
        .attr("class", brush ? "brush-line brush-line" + label  : "line " + label)
        .attr("d", d3.line()
            .x(d => xAxis(new Date(d.year)))
            .y(d => yAxis(d.gdp))
        )
}

/**
 *
 * @param maxNr
 * @returns {number}
 */
function getRandomNumber(maxNr) {
    return Math.floor(Math.random() * maxNr);
}

/**
 *
 * @param xAxis
 * @param yAxis
 * @param data
 * @param brushArea
 */
function drawLines(xAxis, yAxis, data, brushArea) {
    data.forEach((d, i) => {
        const dataArr = Object
            .keys(d)
            .filter(key => key !== Props.state)
            .map(key => ({
                year: key,
                gdp: +d[key]
            }))
        drawSingleLine(xAxis, yAxis, dataArr, colorArray[i], brushArea, d[Props.state])
    })
}

/**
 *
 * @param data
 * @returns {*}
 */
function generateColorArray(data) {
    return data.map((d,i) => `rgb(${getRandomNumber(255)+i}, ${getRandomNumber(255)+i}, ${getRandomNumber(255)+i})`)
}

/**
 *
 * @param activeObject
 * @param state
 * @returns {*}
 */
function getActiveObject(activeObject, state) {
    return activeObject.find(aO => aO[ActiveObjectProps.id] === state)
}

/**
 * Zoom out on double click
 */
let idleTimeout
function idled() { idleTimeout = null; }

/**
 *
 * @param event
 * @param xScale
 * @param yScaleBrush
 * @param yScale
 * @param brush
 * @param axisBrushLineChart
 * @param xAxisBrushLineChart
 * @param axis
 * @param xAxis
 * @returns {number}
 */
function updateChart(event, xScale, yScaleBrush, yScale, brush, axisBrushLineChart, xAxisBrushLineChart, axis, xAxis) {
    let extent = event.selection

    if(!extent){
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350);
        xScale.domain([new Date("1997"),new Date("2020")])
    } else {
        xScale.domain([ xScale.invert(extent[0]), xScale.invert(extent[1]) ])
        brushArea.select(".brush").call(brush.move, null)
    }
    // update line chart
    axis.call(xAxis);
    lineChartArea.selectAll(".line")
        .transition().duration(1000)
        .attr("d", d3.line()
            .x(d => xScale(new Date(d.year)))
            .y(d => yScale(d.gdp))
        );

    //update brush chart
    axisBrushLineChart.call(xAxisBrushLineChart);
    brushArea.selectAll(".brush-line")
        .transition().duration(1000)
        .attr("d", d3.line()
            .x(d => xScale(new Date(d.year)))
            .y(d => yScaleBrush(d.gdp))
        );
}

/**
 *
 * @param event
 */
function onMouseOver (event) {
    const state = event.path[0].classList[1];
    const activeObject = getActiveObject(activeObjects, state)
    if (!activeObject) {
        // save current color and the name of the state as id
        activeObjects.push({
            [ActiveObjectProps.color]: d3.select(this).attr("stroke"),
            [ActiveObjectProps.id]: state
        })
    }
    // change color to black
    d3.select(this)
        .attr("stroke", "black")
        .attr("id", state)

    // add text to the path
    lineChartArea.append("text")
        .append("textPath")
        .attr("xlink:href", `#${state}`)
        .attr("id", `${state}-text`)
        .attr("startOffset", "80%")
        .text(state)
}

/**
 *
 * @param event
 */
function onMouseOut (event) {
    const state = event.path[0].classList[1];
    const activeObject = getActiveObject(activeObjects, state);
    if (!activeObject || !activeObject[ActiveObjectProps.active]) {
        // remove text from line chart
        lineChartArea.select(`.${state}-text`).remove()
        // remove black color and add the old one
        d3.select(this)
            .attr("stroke", activeObjects.find(aO => aO[ActiveObjectProps.id] === state)[ActiveObjectProps.color])
            .attr("id", "")
        activeObjects = activeObjects.filter(aO => aO[ActiveObjectProps.id] !== state)
    }
}

/**
 *
 * @param event
 */
function onClick (event) {
    const state = event.path[0].classList[1];
    const activeObject = getActiveObject(activeObjects, state);
    if (activeObject)  activeObject[ActiveObjectProps.active] = !activeObject[ActiveObjectProps.active];
}

/**
 *
 */
(async function () {
   const data = await getData();
   colorArray = generateColorArray(data);

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
     * Add Axis
     */
    const xAxis = d3.axisBottom(xScale);
    const axis = lineChart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)

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
     * Adding hover effects
     */
    lineChartArea.selectAll(".line")
        .on("mouseover",  onMouseOver)
        .on("mouseout", onMouseOut)
        .on("click", onClick)


    /**
     * -------------------------- BRUSHING AREA-----------------------------
     */
    const yScaleBrushingArea = calculateScale([heightBrush, 0], yDomain, "y");

    /**
     * Add Axis
     */
    const xAxisBrushLineChart = d3.axisBottom(xScale);
    const axisBrushLineChart = brushLineChart.append("g")
        .attr("transform", `translate(0, ${heightBrush})`)
        .call(xAxisBrushLineChart)
    axisBrushLineChart.transition().duration(1000);

    brushLineChart.append("g")
        .call(d3.axisLeft(yScaleBrushingArea).tickValues([0, 1000000, 2000000, 3000000]))

    /**
     * Draw lines
     */
    drawLines(xScale, yScaleBrushingArea, data, true);

    /**
     * Brushing
     */
    const brush = d3.brushX()
        .extent([[0, 0], [width, heightBrush]])
        .on("end", (e) => updateChart(e, xScale, yScaleBrushingArea, yScale, brush,
            axisBrushLineChart, xAxisBrushLineChart, axis, xAxis));

    brushArea.append("g").attr("class", "brush").call(brush);
}())