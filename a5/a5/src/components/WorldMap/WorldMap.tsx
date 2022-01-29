import React, { useLayoutEffect, useState } from "react";
import { initWorldMap } from "./model.worldMap";
import { remToPixel } from "../../utils/utils.layout";

const padding = 16;

export default function WorldMap() {
  const [height] = useState(
    Math.min(window.innerHeight, 900) - remToPixel(padding)
  );
  const [width] = useState(
    Math.min(window.innerWidth, 1440) - remToPixel(padding)
  );

  useLayoutEffect(() => {
    initWorldMap(height, width).then(() => {
      console.log("map finished drawing");
    });
  }, []);

  return (
    <div className={"flex justify-center"}>
      <svg id={"world-map"} height={height} width={width} />
    </div>
  );
}
