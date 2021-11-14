import React, { useLayoutEffect, useState } from "react";
import d3, { svg } from "d3";

export default function ChoroplethMap() {
  const [width] = useState(window.innerWidth);
  const [height] = useState(window.innerWidth);
  useLayoutEffect(() => {}, []);

  return <svg id={"map-svg"} height={height} width={width} />;
}
