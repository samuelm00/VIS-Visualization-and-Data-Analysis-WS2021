import React, { createContext, useState } from "react";
import { AggregationProps } from "../components/CustomAggregator/CustomAggregetor";

interface AggregationFilterProvider {
  children: React.ReactNode;
}

export type AggregationCategory = "People" | "Development";

interface AggregationFilterContextState {
  weights: AggregationProps;
  percentages: AggregationProps;
  setWeights: (weights: AggregationProps) => void;
  setPercentages: (percentages: AggregationProps) => void;
  currentCategory: AggregationCategory;
  setCurrentCategory: (category: AggregationCategory) => void;
}

export const AggregationFilterContext =
  createContext<AggregationFilterContextState>({
    weights: getDefaultWeights(),
    percentages: getDefaultPercentages(),
    setWeights: () => {},
    setPercentages: () => {},
    currentCategory: "People",
    setCurrentCategory: () => {},
  });

export default function AggregationFilterProvider({
  children,
}: AggregationFilterProvider) {
  const [weights, setWeights] = useState(getDefaultWeights());
  const [percentages, setPercentages] = useState(getDefaultPercentages());
  const [currentCategory, setCurrentCategory] =
    useState<AggregationCategory>("People");

  return (
    <AggregationFilterContext.Provider
      value={{
        weights,
        percentages,
        setWeights,
        setPercentages,
        currentCategory,
        setCurrentCategory,
      }}
    >
      {children}
    </AggregationFilterContext.Provider>
  );
}

/**
 *
 */
function getDefaultWeights(): AggregationProps {
  return {
    People: {
      "People > 65": 1,
      "Handwashing facilities": 1,
      Smokers: 1,
    },
    Development: {
      "Diabetes Prevalence": 1,
      "Extreme Poverty": 1,
    },
  };
}

function getDefaultPercentages(): AggregationProps {
  return {
    People: {
      "People > 65": 0,
      "Handwashing facilities": 0,
      Smokers: 0,
    },
    Development: {
      "Diabetes Prevalence": 0,
      "Extreme Poverty": 0,
    },
  };
}
