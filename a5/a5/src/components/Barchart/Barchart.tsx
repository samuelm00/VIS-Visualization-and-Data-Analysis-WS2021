import React, { useLayoutEffect, useState } from "react";
import { remToPixel } from "../../utils/utils.layout";
import { initBarchart, updateBarchart } from "./model.barchart";
import { useCurrentYear, useDataSet } from "../../hooks/hook.dataset";

export default function Barchart() {
  const dataSet = useDataSet();
  const { currentYear } = useCurrentYear();
  const [height] = useState(716);
  const [width] = useState(
    (Math.min(window.innerWidth, 1440) - remToPixel(16)) / 2
  );

  useLayoutEffect(() => {
    initBarchart(height, width, currentYear, dataSet).then(() => {
      console.log("Barchart initialized");
    });
  }, []);

  useLayoutEffect(() => {
    updateBarchart(height, width, currentYear, dataSet);
  }, [currentYear]);

  return (
    <>
      <svg id={"barchart"} height={height} width={width} />
      <div
        id={"barchart-tooltip"}
        className={
          "absolute bg-base-100 px-2 border-2 border-base-200 opacity-0"
        }
      />
    </>
  );
}
