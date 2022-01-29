import React from "react";
import Slider from "rc-slider";
import { useCurrentYear } from "../../hooks/hook.dataset";

export default function YearSlider() {
  const { setCurrentYear, currentYear } = useCurrentYear();

  return (
    <Slider
      value={currentYear}
      onChange={(e) => setCurrentYear(e)}
      min={2015}
      max={2022}
      step={1}
      marks={{
        2015: "2015",
        2016: "2016",
        2017: "2017",
        2018: "2018",
        2019: "2019",
        2020: "2020",
        2021: "2021",
        2022: "2022",
      }}
    />
  );
}
