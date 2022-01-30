import { useContext } from "react";
import { AggregationFilterContext } from "../provider/AggregationFilterProvider";

export function useCustomAggregation() {
  return useContext(AggregationFilterContext);
}
