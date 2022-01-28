import React, { useState } from "react";
import Select from "../Select/Select";
import AggregationItem from "./AggregationItem";

const categories = ["People", "Development"];
const aggregators = {
  People: ["People > 65", "Handwashing facilities", "Smokers"],
  Development: ["TBS"],
};

export default function CustomAggregator() {
  const [currentCategory, setCurrentCategory] = useState<
    "People" | "Development"
  >("People");
  const [weights, setWeights] = useState({
    People: {
      "People > 65": 1,
      "Handwashing facilities": 1,
      Smokers: 1,
    },
    Development: {
      TBS: 1,
    },
  });

  const [percentages, setPercentages] = useState({
    People: {
      "People > 65": 0,
      "Handwashing facilities": 0,
      Smokers: 0,
    },
    Development: {
      TBS: 0,
    },
  });

  return (
    <div className={"flex items-center"}>
      <div>
        <Select
          options={categories}
          value={currentCategory}
          setValue={setCurrentCategory}
          label={"Category:"}
        />
      </div>
      <div className={"w-full space-y-2"}>
        {Object.keys(weights[currentCategory]).map((key, index) => (
          <AggregationItem
            key={index}
            label={"Test"}
            // @ts-ignore
            weight={weights[currentCategory][key]}
            setWeight={() => {}}
            // @ts-ignore
            percentage={percentages[currentCategory][key]}
            setPercentage={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
