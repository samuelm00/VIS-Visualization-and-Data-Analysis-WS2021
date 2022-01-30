export interface DataSetType {
  continent?: string;
  location: string;
  aged_65_older?: number;
  male_smokers?: number;
  female_smokers?: number;
  population: number;
  extreme_poverty?: number;
  diabetes_prevalence?: number;
  data: TimeDataMeasurements[];
}

export interface TimeDataMeasurements {
  date: string;
  new_cases?: number;
  new_vaccinations?: number;
  total_cases: number;
  positive_rate?: number;
}
