import React, { createContext, useState } from "react";
import { AggregationProps } from "../components/CustomAggregator/CustomAggregetor";

interface AggregationFilterProvider {
  children: React.ReactNode;
}

interface AggregationFilterContextState {
  weights: AggregationProps;
  percentages: AggregationProps;
  setWeights: (weights: AggregationProps) => void;
  setPercentages: (percentages: AggregationProps) => void;
}

export const AggregationFilterContext =
  createContext<AggregationFilterContextState>({
    weights: getDefaultWeights(),
    percentages: getDefaultPercentages(),
    setWeights: () => {},
    setPercentages: () => {},
  });

export default function AggregationFilterProvider({
  children,
}: AggregationFilterProvider) {
  const [weights, setWeights] = useState(getDefaultWeights());
  const [percentages, setPercentages] = useState(getDefaultPercentages());

  return (
    <AggregationFilterContext.Provider
      value={{
        weights,
        percentages,
        setWeights,
        setPercentages,
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
      TBS: 0,
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
      TBS: 0,
    },
  };
}
