import React, { useState } from "react";
import ChoroplethMap from "./components/ChoroplethMap";
import ScatterPlot from "./components/ScatterPlot";
import "rc-slider/assets/index.css";
import YearSlider from "./components/YearSlider";

function App() {
  const [currentYear, setCurrentYear] = useState<number>(2006);
  return (
    <main className={"flex justify-center"}>
      <div className={"px-8"} style={{ maxWidth: 1400 }}>
        <div className={"mt-8"}>
          <YearSlider year={currentYear} setYear={setCurrentYear} />
        </div>
        <div className={"flex items-center justify-center space-x-10 h-screen"}>
          <div>
            <ScatterPlot currentYear={currentYear} />
          </div>
          <div>
            <ChoroplethMap currentYear={currentYear} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
