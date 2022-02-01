import React from "react";
import PageLayout from "./components/Layout/PageLayout";
import Header from "./components/Layout/Header";
import WorldMap from "./components/WorldMap/WorldMap";
import Slider from "./components/Slider/Slider";
import Card from "./components/Card/Card";
import CustomAggregator from "./components/CustomAggregator/CustomAggregetor";
import WeightScatterPlot from "./components/Scatterplot/WeightScatterPlot";
import VaccinationScatterPlot from "./components/Scatterplot/VaccinationScatterPlot";
import Barchart from "./components/Barchart/Barchart";
import DataSetProvider from "./provider/DataSetProvider";
import AggregationFilterProvider from "./provider/AggregationFilterProvider";
import LocationAutocomplete from "./components/Autocomplete/LocationAutocomplete";

function App() {
  return (
    <DataSetProvider>
      <PageLayout>
        <Header variant={"page"}>COVID-19 Dashboard</Header>
        <AggregationFilterProvider>
          <WorldMap />
          <Card>
            <div className={"flex justify-center items-center space-x-21"}>
              <div className="flex w-full space-x-10">
                <div>
                  <h3 className={"text font-bold"}>Location:</h3>
                  <LocationAutocomplete />
                </div>
                <div className={"w-full h-full"}>
                  <h3 className={"text font-bold"}>Year:</h3>
                  <div className={"flex h-[50px] items-center"}>
                    <Slider />
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <div className="flex justify-between">
            <Card className={"w-1/2"}>
              <CustomAggregator />
            </Card>
            <WeightScatterPlot />
          </div>
        </AggregationFilterProvider>
        <div className="flex justify-between">
          <div className={"w-1/2"}>
            <VaccinationScatterPlot />
          </div>
          <div>
            <Barchart />
          </div>
        </div>
      </PageLayout>
    </DataSetProvider>
  );
}

export default App;
