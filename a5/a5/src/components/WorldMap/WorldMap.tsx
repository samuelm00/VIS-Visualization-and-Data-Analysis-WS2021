import React, { useLayoutEffect, useState } from "react";
import { initWorldMap } from "./model.worldMap";
import { remToPixel } from "../../utils/utils.layout";

const padding = 16;

export default function WorldMap() {
  const [height] = useState(window.innerHeight - remToPixel(padding));
  const [width] = useState(window.innerWidth - remToPixel(padding));

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
