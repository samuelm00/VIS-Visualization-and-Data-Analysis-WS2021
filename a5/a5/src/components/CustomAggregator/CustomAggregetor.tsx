import React, { useState } from "react";
import Select from "../Select/Select";
import AggregationItem from "./AggregationItem";
import { useCustomAggregation } from "../../hooks/hook.aggregation";

const categories = ["People", "Development"];

export interface AggregationProps {
  People: {
    "People > 65": number;
    "Handwashing facilities": number;
    Smokers: number;
  };
  Development: {
    TBS: number;
  };
}

export default function CustomAggregator() {
  const {
    setCurrentCategory,
    currentCategory,
    setPercentages,
    percentages,
    weights,
    setWeights,
  } = useCustomAggregation();

  return (
    <div className={"space-y-8"}>
      <div className={"w-full"}>
        <Select
          options={categories}
          value={currentCategory}
          setValue={setCurrentCategory}
          label={"Category:"}
        />
      </div>
      <div className={"w-full space-y-2"}>
        <h2>Weights/Percentages: </h2>
        {Object.keys(weights[currentCategory]).map((key, index) => (
          <AggregationItem
            key={index}
            label={key}
            // @ts-ignore
            weight={weights[currentCategory][key]}
            setWeight={(value) =>
              setWeights({
                ...weights,
                [currentCategory]: {
                  ...weights[currentCategory],
                  [key]: value,
                },
              })
            }
            // @ts-ignore
            percentage={percentages[currentCategory][key]}
            setPercentage={(value) =>
              setPercentages({
                ...percentages,
                [currentCategory]: {
                  ...percentages[currentCategory],
                  [key]: value,
                },
              })
            }
          />
        ))}
      </div>
    </div>
  );
}
