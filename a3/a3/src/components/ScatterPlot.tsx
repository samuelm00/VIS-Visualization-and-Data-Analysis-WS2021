import React, { useLayoutEffect, useState } from "react";
import { createScatterPlot, margin } from "../model/model.scatterPlot";
import * as d3 from "d3";

interface ScatterPlotProps {
  currentYear: string;
}

export default function ScatterPlot({ currentYear }: ScatterPlotProps) {
  const [width] = useState(window.innerWidth / 3);
  const [height] = useState(window.innerHeight / 2);

  useLayoutEffect(() => {
    d3.select(`#scatter-plot`)
      .append("g")
      .attr("id", "plot")
      .attr("transform", "translate(" + margin * 1.2 + "," + margin / 2 + ")");

    createScatterPlot("plot", "2011", height, width);
  }, []);

  return <svg height={height} width={width} id={"scatter-plot"} />;
}
