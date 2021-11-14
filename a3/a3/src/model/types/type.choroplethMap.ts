export interface BaDegreeData {
  [key: string]: number | string;
  State: string;
}

export interface IncomeData extends BaDegreeData {}

export interface GeoData {
  features: any[];
  type: string;
}
