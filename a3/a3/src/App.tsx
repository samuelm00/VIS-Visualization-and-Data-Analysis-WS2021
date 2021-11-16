import React from "react";
import ChoroplethMap from "./components/ChoroplethMap";
import ScatterPlot from "./components/ScatterPlot";

function App() {
  return (
    <main className={"flex items-center justify-between h-screen"}>
      <ScatterPlot />
      <ChoroplethMap />
    </main>
  );
}

export default App;
