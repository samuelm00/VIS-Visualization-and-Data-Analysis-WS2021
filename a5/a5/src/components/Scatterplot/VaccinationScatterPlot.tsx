import React, { useLayoutEffect, useState } from "react";
import { remToPixel } from "../../utils/utils.layout";
import { initVaccinationScatterPlot } from "./model.vaccinationScatterplot";

export default function VaccinationScatterPlot() {
  const [height] = useState(516);
  const [width] = useState((window.innerWidth - remToPixel(16)) / 2);

  useLayoutEffect(() => {
    initVaccinationScatterPlot(height, width);
    console.log("here");
  }, []);

  return (
    <>
      <svg id={"vaccination-scatter-plot"} height={height} width={width} />
      <div
        id={"vaccination-scatter-tooltip"}
        className={
          "absolute bg-base-100 px-2 border-2 border-base-200 opacity-0"
        }
      />
    </>
  );
}
