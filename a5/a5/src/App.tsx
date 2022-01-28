import React from "react";
import PageLayout from "./components/Layout/PageLayout";
import Header from "./components/Layout/Header";
import WorldMap from "./components/WorldMap/WorldMap";

function App() {
  return (
    <PageLayout>
      <Header variant={"page"}>COVID-19 Dashboard</Header>
      <WorldMap />
    </PageLayout>
  );
}

export default App;
