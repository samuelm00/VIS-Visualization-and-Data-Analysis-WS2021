import React, { useLayoutEffect, useState } from "react";
import { remToPixel } from "../../utils/utils.layout";
import { initVaccinationScatterPlot } from "./model.vaccinationScatterplot";
import { useDataSet } from "../../hooks/hook.dataset";

export default React.memo(function VaccinationScatterPlot() {
  const dataSet = useDataSet();
  const [height] = useState(516);
  const [width] = useState(
    (Math.min(window.innerWidth, 1440) - remToPixel(16)) / 2
  );

  useLayoutEffect(() => {
    initVaccinationScatterPlot(height, width, dataSet).then(() => {
      console.log("VaccinationScatterPlot initialized");
    });
  }, [height, width]);

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
});
