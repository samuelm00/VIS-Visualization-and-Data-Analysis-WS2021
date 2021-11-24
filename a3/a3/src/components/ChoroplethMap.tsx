import React, { useLayoutEffect, useState } from "react";
import { createMap, updateMap } from "../model/model.choroplethMap";

interface ChoroplethMapProps {
  currentYear: number;
  selectedBrushPoints: string[];
  setSelectedBrushPoints: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ChoroplethMap({
  currentYear,
  selectedBrushPoints,
}: ChoroplethMapProps) {
  const [width] = useState(900);
  const [height] = useState(500);

  useLayoutEffect(() => {
    createMap("map-svg", currentYear.toString());
  }, []);

  useLayoutEffect(() => {
    updateMap("map-svg", currentYear.toString(), selectedBrushPoints);
  }, [currentYear, selectedBrushPoints]);

  return (
    <>
      <svg id={"map-svg"} height={height} width={width} />;
      <div
        id={"map-tooltip"}
        className={"absolute bg-white px-2 border-2 opacity-0"}
      />
    </>
  );
}
