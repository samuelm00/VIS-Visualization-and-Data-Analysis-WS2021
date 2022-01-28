import React, { useLayoutEffect, useState } from "react";
import { remToPixel } from "../../utils/utils.layout";
import { initScatterPlot } from "./model.scatterplot";

export default function Scatterplot() {
  const [height] = useState(516);
  const [width] = useState((window.innerWidth - remToPixel(16)) / 2);

  useLayoutEffect(() => {
    initScatterPlot(height, width);
  }, []);

  return <svg id={"scatter-plot"} height={height} width={width} />;
}
