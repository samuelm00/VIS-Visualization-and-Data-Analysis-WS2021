import React from "react";
import ChoroplethMap from "./components/ChoroplethMap";
import ScatterPlot from "./components/ScatterPlot";

function App() {
  return (
    <main>
      <ChoroplethMap />
      <div className={"flex justify-center"}>
        <ScatterPlot />
      </div>
    </main>
  );
}

export default App;
