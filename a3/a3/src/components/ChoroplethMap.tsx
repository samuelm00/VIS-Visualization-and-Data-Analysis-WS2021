import React, { useLayoutEffect, useState } from "react";
import {
  basicMap,
  createMap,
  getBaDegreeData,
  getIncomeData,
} from "../model/model.choroplethMap";

export default function ChoroplethMap() {
  const [currentYear, setCurrentYear] = useState("2011");
  const [width] = useState(window.innerWidth);
  const [height] = useState(window.innerHeight);

  useLayoutEffect(() => {
    createMap("map-svg", currentYear);
  }, [currentYear]);

  return <svg id={"map-svg"} height={height} width={width} />;
}
