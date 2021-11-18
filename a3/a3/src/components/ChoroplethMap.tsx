import React, { useLayoutEffect, useState } from "react";
import { createMap, updateMap } from "../model/model.choroplethMap";
import * as d3 from "d3";

interface ChoroplethMapProps {
  currentYear: number;
}

export default function ChoroplethMap({ currentYear }: ChoroplethMapProps) {
  const [width] = useState(900);
  const [height] = useState(500);

  useLayoutEffect(() => {
    createMap("map-svg", currentYear.toString());
  }, []);

  useLayoutEffect(() => {
    updateMap("map-svg", currentYear.toString());
  }, [currentYear]);

  return <svg id={"map-svg"} height={height} width={width} />;
}
