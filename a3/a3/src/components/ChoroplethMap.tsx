import React, { useLayoutEffect, useState } from "react";
import {
  basicMap,
  createMap,
  getBaDegreeData,
  getIncomeData,
} from "../model/model.choroplethMap";

export default function ChoroplethMap() {
  const [width] = useState(window.innerWidth);
  const [height] = useState(window.innerHeight);

  const constructMap = async () => {
    const baDegreeData = await getBaDegreeData();
    const incomeData = await getIncomeData();
    console.log(incomeData);
  };

  useLayoutEffect(() => {
    // init map
    createMap("map-svg", "2011");
  }, []);

  return <svg id={"map-svg"} height={height} width={width} />;
}
