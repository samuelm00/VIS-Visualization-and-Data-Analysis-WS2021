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

const svgElement = d3.select("#line-chart");
const brushSvg = d3.select("#brush-svg");

const brushLineChart = brushSvg.append("g").attr("transform", `translate(${margin}, ${margin})`);
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
 * @param color
 * @param brushArea
 */
function drawSingleLine(xAxis, yAxis, data, color, brushArea) {
    (brushArea ? brushLineChart : lineChart).append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 3)
        .attr("class", brushArea ? "brush-line" : "line")
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
        drawSingleLine(xAxis, yAxis, dataArr,
            `rgb(${getRandomNumber(255)+i}, ${getRandomNumber(255)+i}, ${getRandomNumber(255)+i})`, brushArea)
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
     * Adding hover effects
     */
    lineChart.selectAll("path")
        .data(data)
        .on("mouseover", function (event, data) {
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
        })
        .on("mouseout", function (event, data) {
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
        })
        .on("click", function (event, data) {
            const activeObject = getActiveObject(activeObjects, data);
            if (activeObject)  activeObject[ActiveObjectProps.active] = !activeObject[ActiveObjectProps.active];
        })


    /**
     * -------------------------- BRUSHING AREA
     */
    const xScaleBrushingArea = calculateScale([0, width]);
    const yScaleBrushingArea = calculateScale([heightBrush, 0], yDomain, "y");

    /**
     * Add Axis
     */
    const xAxis = d3.axisBottom(xScaleBrushingArea);
    const axis = brushLineChart.append("g")
        .attr("transform", `translate(0, ${heightBrush})`)
        .call(xAxis)
    axis.transition().duration(1000);

    brushLineChart.append("g")
        .call(d3.axisLeft(yScaleBrushingArea).tickValues([0, 1000000, 2000000, 3000000]))

    /**
     * Draw lines
     */
    drawLines(xScaleBrushingArea, yScaleBrushingArea, data, true);

    /**
     * Brushing
     */
    const brush = d3.brushX()
        .extent([[0, 0], [width, heightBrush]])
        .on("end", (e) => updateChart(e, xScaleBrushingArea, yScaleBrushingArea, brush, axis, xAxis));

    brushLineChart.append("g").attr("class", "brush").call(brush);

    let idleTimeout
    function idled() { idleTimeout = null; }

    function updateChart(event, xScale, yScale, brush, axis, xAxis) {
        let extent = event.selection

        if(!extent){
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
            xScale.domain([new Date("1997"),new Date("2020")])
        } else {
            xScale.domain([ xScale.invert(extent[0]), xScale.invert(extent[1]) ]) //scale.invert scales the values back to the domain space
            brushLineChart.select(".brush").call(brush.move, null) // This: Remove the grey brush area as soon as the selection has been done
        }
        axis.call(xAxis);
        brushLineChart.selectAll(".brush-line")
            .transition().duration(1000)
            .attr("d", d3.line()
                .x(d => xScale(new Date(d.year)))
                .y(d => yScale(d.gdp))
            )
    }
}())