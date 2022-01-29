import React, { useLayoutEffect, useState } from "react";
import { remToPixel } from "../../utils/utils.layout";
import { initBarchart } from "./model.barchart";
import { useDataSet } from "../../hooks/hook.dataset";

export default function Barchart() {
  const dataSet = useDataSet();
  const [height] = useState(716);
  const [width] = useState(
    (Math.min(window.innerWidth, 1440) - remToPixel(16)) / 2
  );

  useLayoutEffect(() => {
    initBarchart(height, width, 2020, dataSet).then(() => {
      console.log("Barchart initialized");
    });
  }, []);

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
