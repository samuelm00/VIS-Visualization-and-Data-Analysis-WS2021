import React from "react";
import PageLayout from "./components/Layout/PageLayout";
import Header from "./components/Layout/Header";

function App() {
  return (
    <PageLayout>
      <Header variant={"page"}>Page</Header>
      <Header variant={"section"}>Section</Header>
    </PageLayout>
  );
}

export default App;
