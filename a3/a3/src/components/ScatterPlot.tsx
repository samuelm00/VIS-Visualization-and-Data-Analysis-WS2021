import React, { useLayoutEffect, useState } from "react";
import {
  createScatterPlot,
  updateScatterPlot,
  margin,
  updateCircles,
} from "../model/model.scatterPlot";
import * as d3 from "d3";

interface ScatterPlotProps {
  currentYear: number;
  selectedBrushPoints: string[];
  setSelectedBrushPoints: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ScatterPlot({
  currentYear,
  setSelectedBrushPoints,
  selectedBrushPoints,
}: ScatterPlotProps) {
  const [width] = useState(window.innerWidth / 3);
  const [height] = useState(window.innerHeight / 2);

  useLayoutEffect(() => {
    d3.select(`#scatter-plot`)
      .append("g")
      .attr("height", height - margin * 2)
      .attr("width", width - margin * 2)
      .attr("id", "plot")
      .attr("transform", "translate(" + margin * 2 + "," + margin + ")");

    createScatterPlot(
      "plot",
      currentYear.toString(),
      height - margin * 2,
      width - margin * 2,
      setSelectedBrushPoints
    );
  }, []);

  useLayoutEffect(() => {
    updateScatterPlot(
      "plot",
      currentYear.toString(),
      height - margin * 2,
      width - margin * 2
    );
  }, [currentYear]);

  useLayoutEffect(() => {
    updateCircles(selectedBrushPoints);
  }, [selectedBrushPoints]);

  return (
    <>
      <svg height={height} width={width} id={"scatter-plot"} />
      <div
        id={"scatter-tooltip"}
        className={"absolute bg-white px-2 border-2 opacity-0"}
      />
    </>
  );
}
