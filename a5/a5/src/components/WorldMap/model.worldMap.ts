import {
  select,
  json,
  geoPath,
  geoMercator,
  geoEqualEarth,
  geoEquirectangular,
} from "d3";

export async function initWorldMap(height: number, width: number) {
  const svg = select("#world-map");
  const projection = geoEquirectangular().fitSize([width, height], {
    type: "Sphere",
    coordinates: [0, 0],
  });
  const path = geoPath().projection(projection);

  const data: any = await json(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
  );

  svg
    .append("g")
    .selectAll("path")
    .data(data.features as any[])
    .enter()
    .append("path")
    .attr("d", path)
    .attr("stroke", "#3d4451")
    .attr("fill", (d) => {
      return "white";
    });
}
