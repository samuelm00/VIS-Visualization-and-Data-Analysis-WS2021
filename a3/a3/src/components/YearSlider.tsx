import React from "react";
import Slider from "rc-slider";

interface YearSliderProps {
  year: number;
  setYear: React.Dispatch<React.SetStateAction<number>>;
}

export default function YearSlider({ year, setYear }: YearSliderProps) {
  return (
    <Slider
      value={year}
      onChange={(e) => setYear(e)}
      min={2006}
      max={2019}
      step={1}
      marks={{
        2006: "2006",
        2007: "2007",
        2008: "2008",
        2009: "2009",
        2010: "2010",
        2011: "2011",
        2012: "2012",
        2013: "2013",
        2014: "2014",
        2015: "2015",
        2016: "2016",
        2017: "2017",
        2018: "2018",
        2019: "2019",
      }}
    />
  );
}
