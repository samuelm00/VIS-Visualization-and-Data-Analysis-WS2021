import React from "react";
import PageLayout from "./components/Layout/PageLayout";
import Header from "./components/Layout/Header";
import WorldMap from "./components/WorldMap/WorldMap";
import Slider from "./components/Slider/Slider";
import Card from "./components/Card/Card";
import CustomAggregator from "./components/CustomAggregator/CustomAggregetor";

function App() {
  const [currentYear, setCurrentYear] = React.useState(2006);

  return (
    <PageLayout>
      <Header variant={"page"}>COVID-19 Dashboard</Header>
      <WorldMap />
      <Card>
        <div className={"flex justify-center items-center space-x-10"}>
          <h3 className={"text font-bold"}>Year:</h3>
          <Slider value={currentYear} setValue={setCurrentYear} />
        </div>
      </Card>
      <Card className={"w-1/2"}>
        <CustomAggregator />
      </Card>
    </PageLayout>
  );
}

export default App;
