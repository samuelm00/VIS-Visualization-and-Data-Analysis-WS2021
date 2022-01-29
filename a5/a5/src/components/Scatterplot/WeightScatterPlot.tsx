import React, { useLayoutEffect, useState } from "react";
import { remToPixel } from "../../utils/utils.layout";
import { initWeightedScatterPlot } from "./model.weightScatterplot";

export default function WeightScatterPlot() {
  const [height] = useState(516);
  const [width] = useState((window.innerWidth - remToPixel(16)) / 2);

  useLayoutEffect(() => {
    initWeightedScatterPlot(
      height,
      width,
      2020,
      {
        People: {
          "People > 65": 1,
          "Handwashing facilities": 1,
          Smokers: 1,
        },
        Development: {
          TBS: 1,
        },
      },
      {
        People: {
          "People > 65": 1,
          "Handwashing facilities": 1,
          Smokers: 1,
        },
        Development: {
          TBS: 1,
        },
      },
      "People"
    );
  }, []);

  return (
    <>
      <svg id={"scatter-plot"} height={height} width={width} />
      <div
        id={"scatter-tooltip"}
        className={
          "absolute bg-base-100 px-2 border-2 border-base-200 opacity-0"
        }
      />
    </>
  );
}
