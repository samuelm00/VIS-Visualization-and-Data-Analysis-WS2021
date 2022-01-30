import React, { useLayoutEffect, useState } from "react";
import { remToPixel } from "../../utils/utils.layout";
import {
  initWeightedScatterPlot,
  updateWeightedScatterPlot,
} from "./model.weightScatterplot";
import { useCurrentYear, useDataSet } from "../../hooks/hook.dataset";
import { useCustomAggregation } from "../../hooks/hook.aggregation";

export default React.memo(function WeightScatterPlot() {
  const { currentCategory, percentages, weights } = useCustomAggregation();
  const { currentYear } = useCurrentYear();
  const dataSet = useDataSet();
  const [height] = useState(516);
  const [width] = useState(
    (Math.min(window.innerWidth, 1440) - remToPixel(16)) / 2
  );

  useLayoutEffect(() => {
    initWeightedScatterPlot(
      height,
      width,
      currentYear,
      dataSet,
      weights,
      percentages,
      currentCategory
    );
  }, []);

  useLayoutEffect(() => {
    updateWeightedScatterPlot(
      height,
      width,
      currentYear,
      dataSet,
      weights,
      percentages,
      currentCategory
    );
  }, [currentYear]);

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
});
