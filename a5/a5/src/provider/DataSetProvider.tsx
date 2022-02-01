import React, { useEffect, useState } from "react";
import { DataSetType } from "../types/type.dataset";
import LoadingIndicator from "../components/LoadingIndicator";
import { getDataset } from "../utils/utils.dataset";

interface DataSetProviderProps {
  children: React.ReactNode;
}

export interface DataSetProviderState {
  dataSet: DataSetType[];
  currentYear: number;
  setCurrentYear: (year: number) => void;
  currentLocation: string;
  setCurrentLocation: (location: string) => void;
}

export const DataSetContext = React.createContext<DataSetProviderState>({
  dataSet: [],
  currentYear: 2021,
  setCurrentYear: () => {},
  currentLocation: "",
  setCurrentLocation: () => {},
});

export default function DataSetProvider({ children }: DataSetProviderProps) {
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const [dataset, setDataset] = useState<DataSetType[]>([]);
  const [currentYear, setCurrentYear] = useState(2021);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDataset()
      .then((dataSet) => {
        setDataset(dataSet);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className={"h-screen w-screen flex justify-center items-center"}>
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <DataSetContext.Provider
      value={{
        dataSet: dataset,
        currentYear,
        setCurrentYear,
        currentLocation,
        setCurrentLocation,
      }}
    >
      {children}
    </DataSetContext.Provider>
  );
}
