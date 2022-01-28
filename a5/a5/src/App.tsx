import React from "react";
import PageLayout from "./components/Layout/PageLayout";
import Header from "./components/Layout/Header";
import WorldMap from "./components/WorldMap/WorldMap";
import Slider from "./components/Slider/Slider";

function App() {
  const [currentYear, setCurrentYear] = React.useState(2006);

  return (
    <PageLayout>
      <Header variant={"page"}>COVID-19 Dashboard</Header>
      <WorldMap />
      <Slider value={currentYear} setValue={setCurrentYear} />
    </PageLayout>
  );
}

export default App;
