import React, { useEffect, useState } from "react";
import { DataSetType } from "../types/type.dataset";
import LoadingIndicator from "../components/LoadingIndicator";
import { getDataset } from "../utils/utils.dataset";

interface DataSetProviderProps {
  children: React.ReactNode;
}

export interface DataSetProviderState {
  dataSet: DataSetType[];
}

const DataSetContext = React.createContext<DataSetProviderState>({
  dataSet: [],
});

export default function DataSetProvider({ children }: DataSetProviderProps) {
  const [dataset, setDataset] = useState<DataSetType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDataset().then((dataSet) => {
      setDataset(dataSet);
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
    <DataSetContext.Provider value={{ dataSet: [] }}>
      {children}
    </DataSetContext.Provider>
  );
}
