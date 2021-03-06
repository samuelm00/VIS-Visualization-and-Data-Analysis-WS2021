import { useContext } from "react";
import { DataSetContext } from "../provider/DataSetProvider";

/**
 *
 */
export function useDataSet() {
  const { dataSet } = useContext(DataSetContext);
  return dataSet;
}

/**
 *
 */
export function useCurrentYear() {
  const { currentYear, setCurrentYear } = useContext(DataSetContext);
  return { currentYear, setCurrentYear };
}

/**
 *
 */
export function useCurrentLocation() {
  const { currentLocation, setCurrentLocation } = useContext(DataSetContext);
  return { currentLocation, setCurrentLocation };
}
