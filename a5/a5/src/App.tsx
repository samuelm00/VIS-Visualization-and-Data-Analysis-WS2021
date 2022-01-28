import React from "react";
import PageLayout from "./components/Layout/PageLayout";
import Header from "./components/Layout/Header";
import WorldMap from "./components/WorldMap/WorldMap";
import Slider from "./components/Slider/Slider";
import Card from "./components/Card/Card";
import CustomAggregator from "./components/CustomAggregator/CustomAggregetor";
import Scatterplot from "./components/Scatterplot/Scatterplot";
import LoadingIndicator from "./components/LoadingIndicator";
import { getDataset } from "./utils/utils.dataset";

function App() {
  const [currentYear, setCurrentYear] = React.useState(2006);
  const [isLoading, setIsLoading] = React.useState(false);

  if (isLoading) {
    return (
      <div className={"h-screen w-screen flex justify-center items-center"}>
        <LoadingIndicator />
      </div>
    );
  }

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
      <div className="flex">
        <Card className={"w-1/2"}>
          <CustomAggregator />
        </Card>
        <Scatterplot />
      </div>
    </PageLayout>
  );
}

export default App;
