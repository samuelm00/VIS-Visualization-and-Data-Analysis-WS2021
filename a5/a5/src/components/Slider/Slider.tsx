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
      activeDotStyle={{
        borderColor: "white",
        borderWidth: "2px",
        borderStyle: "solid",
      }}
      trackStyle={{
        backgroundColor: "white",
        color: "white",
      }}
      handleStyle={{
        borderColor: "white",
        borderWidth: "2px",
        backgroundColor: "rgb(0, 148, 133)",
        borderStyle: "solid",
      }}
      marks={{
        2020: "2020",
        2021: "2021",
        2022: "2022",
      }}
    />
  );
}
