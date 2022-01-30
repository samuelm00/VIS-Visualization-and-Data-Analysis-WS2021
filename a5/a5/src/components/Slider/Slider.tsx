import React from "react";
import Slider from "rc-slider";
import { useCurrentYear } from "../../hooks/hook.dataset";

export default function YearSlider() {
  const { setCurrentYear, currentYear } = useCurrentYear();

  return (
    <Slider
      value={currentYear}
      onChange={(e) => setCurrentYear(e)}
      min={2020}
      max={2022}
      step={1}
      marks={{
        2020: "2020",
        2021: "2021",
        2022: "2022",
      }}
    />
  );
}
