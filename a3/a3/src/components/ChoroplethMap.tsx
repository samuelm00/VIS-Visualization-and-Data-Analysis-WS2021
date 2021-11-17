import React, { useLayoutEffect, useState } from "react";
import { createMap } from "../model/model.choroplethMap";

interface ChoroplethMapProps {
  currentYear: string;
}

export default function ChoroplethMap({ currentYear }: ChoroplethMapProps) {
  const [width] = useState(window.innerWidth / 1.5);
  const [height] = useState(window.innerHeight / 1.3);

  useLayoutEffect(() => {
    createMap("map-svg", currentYear);
  }, [currentYear]);

  return <svg id={"map-svg"} height={height} width={width} />;
}
