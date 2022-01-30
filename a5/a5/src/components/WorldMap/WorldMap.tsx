import React, { useLayoutEffect, useState } from "react";
import { initWorldMap } from "./model.worldMap";
import { remToPixel } from "../../utils/utils.layout";
import { useCurrentYear, useDataSet } from "../../hooks/hook.dataset";
import { useCustomAggregation } from "../../hooks/hook.aggregation";

const padding = 16;

export default function WorldMap() {
  const dataSet = useDataSet();
  const { weights, percentages, currentCategory } = useCustomAggregation();
  const { currentYear } = useCurrentYear();
  const [height] = useState(
    Math.min(window.innerHeight, 900) - remToPixel(padding)
  );
  const [width] = useState(
    Math.min(window.innerWidth, 1440) - remToPixel(padding)
  );

  useLayoutEffect(() => {
    initWorldMap(
      height,
      width,
      dataSet,
      currentYear,
      weights,
      percentages,
      currentCategory
    ).then(() => {
      console.log("map finished drawing");
    });
  }, []);

  return (
    <div className={"flex justify-center"}>
      <svg id={"world-map"} height={height} width={width} />
      <div
        id={"world-map-tooltip"}
        className={
          "absolute bg-base-100 px-2 border-2 border-base-200 opacity-0"
        }
      />
    </div>
  );
}
