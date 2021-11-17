import React, { useState } from "react";
import ChoroplethMap from "./components/ChoroplethMap";
import ScatterPlot from "./components/ScatterPlot";

function App() {
  const [currentYear, setCurrentYear] = useState<string>("2011");
  return (
    <main className={"flex items-center justify-between h-screen"}>
      <ScatterPlot currentYear={currentYear} />
      <ChoroplethMap currentYear={currentYear} />
    </main>
  );
}

export default App;
