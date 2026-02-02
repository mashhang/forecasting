// Report type definitions and enums

export enum ReportType {
  QUARTERLY_VARIANCE = 'quarterly_variance',
  QUARTERLY_FORECAST = 'quarterly_forecast',
  ANNUAL_VARIANCE_SUMMARY = 'annual_variance_summary',
  ANNUAL_FORECAST_SUMMARY = 'annual_forecast_summary',
  APPROVED_CONSOLIDATED_BUDGET = 'approved_consolidated_budget',
  APPROVED_PER_DEPT_BUDGET = 'approved_per_dept_budget',
}

// Base interfaces for each report type

export interface QuarterlyVarianceData {
  department: string;
  quarter: string;
  forecast: number;
  actual: number;
  variance: number;
  percentage: number;
  status: 'Approved' | 'For Review' | 'Disapproved';
}

export interface QuarterlyForecastData {
  department: string;
  description: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  total: number;
}

export interface AnnualVarianceSummaryData {
  department: string;
  totalForecast: number;
  totalActual: number;
  variance: number;
  percentage: number;
  status: 'Approved' | 'For Review' | 'Disapproved';
}

export interface AnnualForecastSummaryData {
  department: string;
  year: number;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  total: number;
}

export interface ApprovedConsolidatedBudgetData {
  category: string;
  department: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  total: number;
}

export interface ApprovedPerDeptBudgetData {
  department: string;
  category: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  total: number;
}

// Union type for all report data
export type ReportData =
  | QuarterlyVarianceData[]
  | QuarterlyForecastData[]
  | AnnualVarianceSummaryData[]
  | AnnualForecastSummaryData[]
  | ApprovedConsolidatedBudgetData[]
  | ApprovedPerDeptBudgetData[];

// Filter options
export interface ReportFilters {
  department?: string;
  quarter?: string;
  year?: number;
  status?: 'Approved' | 'For Review' | 'Disapproved';
}

// Report configuration for UI and generation
export interface ReportConfig {
  type: ReportType;
  label: string;
  description: string;
  requiredFilters: (keyof ReportFilters)[];
  defaultYear?: number;
}

// CSV export options
export interface CSVExportOptions {
  filename?: string;
  includeTimestamp?: boolean;
  delimiter?: string;
}
