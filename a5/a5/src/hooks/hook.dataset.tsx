import { useContext } from "react";
import { DataSetContext } from "../provider/DataSetProvider";

/**
 *
 */
export function useDataSet() {
  const { dataSet } = useContext(DataSetContext);

  console.log(dataSet);

  return dataSet;
}

/**
 *
 */
export function useCurrentYear() {
  const { currentYear, setCurrentYear } = useContext(DataSetContext);
  return { currentYear, setCurrentYear };
}