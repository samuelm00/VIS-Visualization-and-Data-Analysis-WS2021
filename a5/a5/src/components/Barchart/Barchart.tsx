import React, { useLayoutEffect, useState } from "react";
import { remToPixel } from "../../utils/utils.layout";
import { initBarchart } from "./model.barchart";

export default function Barchart() {
  const [height] = useState(516);
  const [width] = useState((window.innerWidth - remToPixel(16)) / 2);

  useLayoutEffect(() => {
    initBarchart(height, width).then(() => {
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
