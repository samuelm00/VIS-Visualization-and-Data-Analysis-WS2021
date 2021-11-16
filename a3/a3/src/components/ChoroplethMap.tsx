import React, { useLayoutEffect, useState } from "react";
import {
  basicMap,
  createMap,
  getBaDegreeData,
  getIncomeData,
} from "../model/model.choroplethMap";

export default function ChoroplethMap() {
  const [currentYear, setCurrentYear] = useState("2011");
  const [width] = useState(window.innerWidth / 1.5);
  const [height] = useState(window.innerHeight / 1.3);

  useLayoutEffect(() => {
    createMap("map-svg", currentYear);
  }, [currentYear]);

  return <svg id={"map-svg"} height={height} width={width} />;
}
