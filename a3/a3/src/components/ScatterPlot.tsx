import React, { useLayoutEffect, useState } from "react";
import { createScatterPlot, margin } from "../model/model.scatterPlot";
import * as d3 from "d3";

export default function ScatterPlot() {
  const [width] = useState(window.innerWidth / 2);
  const [height] = useState(window.innerHeight / 2);

  useLayoutEffect(() => {
    const svg = d3
      .select(`#scatter-plot`)
      .append("g")
      .attr("id", "plot")
      .attr("transform", "translate(" + margin * 1.2 + "," + margin / 2 + ")");
  }, []);

  useLayoutEffect(() => {
    createScatterPlot("plot", "2011", height, width);
  }, []);

  return <svg height={height} width={width} id={"scatter-plot"} />;
}