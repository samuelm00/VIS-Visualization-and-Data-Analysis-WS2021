import React, { useState } from "react";
import ChoroplethMap from "./components/ChoroplethMap";
import ScatterPlot from "./components/ScatterPlot";
import "rc-slider/assets/index.css";
import YearSlider from "./components/YearSlider";

function App() {
  const [currentYear, setCurrentYear] = useState<number>(2006);
  const [selectedBrushPoints, setSelectedBrushPoints] = useState<string[]>([]);

  console.log(selectedBrushPoints);

  return (
    <main className={"flex justify-center"}>
      <div className={"px-8"} style={{ maxWidth: 1400 }}>
        <div className={"flex justify-center mt-8"}>
          <h1 className={"font-bold text-4xl"}>
            Educational Attainment Rate and the Mean Income's relationship in
            the USA
          </h1>
        </div>
        <div className={"mt-16"}>
          <YearSlider year={currentYear} setYear={setCurrentYear} />
        </div>
        <div className={"mt-28 flex items-center justify-center space-x-10"}>
          <div>
            <ScatterPlot
              selectedBrushPoints={selectedBrushPoints}
              setSelectedBrushPoints={setSelectedBrushPoints}
              currentYear={currentYear}
            />
          </div>
          <div>
            <ChoroplethMap
              setSelectedBrushPoints={setSelectedBrushPoints}
              selectedBrushPoints={selectedBrushPoints}
              currentYear={currentYear}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
