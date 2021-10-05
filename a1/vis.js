const Props = {
    state: "State",
    gdp: "GDP"
}

const data = [];

async function getData() {
    const d = [];
    await d3.csv("usa_nominal_gdp_top10_2021.csv", (rawData) => {
        d.push(rawData);
    })
    console.log(d);
    return d;
}

getData();