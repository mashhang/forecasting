// Report generation orchestration logic

import { ForecastRow } from '../mockData';
import { VarianceAnalysisRow } from '@/app/context/ForecastContext';
import {
  ReportType,
  ReportConfig,
  ReportFilters,
  ReportData,
  QuarterlyVarianceData,
  QuarterlyForecastData,
  AnnualVarianceSummaryData,
  AnnualForecastSummaryData,
  ApprovedConsolidatedBudgetData,
  ApprovedPerDeptBudgetData,
} from './types';

// Re-export types for convenience
export type {
  ReportConfig,
  ReportFilters,
  ReportData,
  QuarterlyVarianceData,
  QuarterlyForecastData,
  AnnualVarianceSummaryData,
  AnnualForecastSummaryData,
  ApprovedConsolidatedBudgetData,
  ApprovedPerDeptBudgetData,
};
export { ReportType };

import * as transformers from './reportTransformers';
import { formatCurrency, formatPercentage } from './csvExporter';

/**
 * Configuration metadata for all report types
 */
export const REPORT_CONFIGS: Record<ReportType, ReportConfig> = {
  [ReportType.QUARTERLY_VARIANCE]: {
    type: ReportType.QUARTERLY_VARIANCE,
    label: 'Quarterly Variance per Department',
    description: 'Shows variance between forecasted and actual spending by quarter and department',
    requiredFilters: [],
  },
  [ReportType.QUARTERLY_FORECAST]: {
    type: ReportType.QUARTERLY_FORECAST,
    label: 'Quarterly Forecasted per Department',
    description: 'Displays forecasted spending amounts for each quarter by department',
    requiredFilters: [],
  },
  [ReportType.ANNUAL_VARIANCE_SUMMARY]: {
    type: ReportType.ANNUAL_VARIANCE_SUMMARY,
    label: 'Annual Variance Summary',
    description: 'Annual variance totals and approval status by department',
    requiredFilters: [],
  },
  [ReportType.ANNUAL_FORECAST_SUMMARY]: {
    type: ReportType.ANNUAL_FORECAST_SUMMARY,
    label: 'Annual Forecast Summary',
    description: 'Annual forecasted spending totals by department',
    requiredFilters: [],
  },
  [ReportType.APPROVED_CONSOLIDATED_BUDGET]: {
    type: ReportType.APPROVED_CONSOLIDATED_BUDGET,
    label: 'Approved Annual Consolidated Budget',
    description: 'Consolidated budget for all approved departments by category',
    requiredFilters: [],
  },
  [ReportType.APPROVED_PER_DEPT_BUDGET]: {
    type: ReportType.APPROVED_PER_DEPT_BUDGET,
    label: 'Approved per Department Budget',
    description: 'Approved budgets broken down by department and category',
    requiredFilters: [],
  },
};

/**
 * Main report generation function
 * Routes to appropriate transformer based on report type
 */
export function generateReport(
  reportType: ReportType,
  forecasts: ForecastRow[],
  varianceData: VarianceAnalysisRow[],
  filters?: ReportFilters
): ReportData {
  switch (reportType) {
    case ReportType.QUARTERLY_VARIANCE:
      return transformers.transformToQuarterlyVariance(forecasts, filters) as QuarterlyVarianceData[];

    case ReportType.QUARTERLY_FORECAST:
      return transformers.transformToQuarterlyForecast(forecasts, filters) as QuarterlyForecastData[];

    case ReportType.ANNUAL_VARIANCE_SUMMARY:
      return transformers.transformToAnnualVarianceSummary(forecasts, varianceData, filters) as AnnualVarianceSummaryData[];

    case ReportType.ANNUAL_FORECAST_SUMMARY:
      return transformers.transformToAnnualForecastSummary(forecasts, filters) as AnnualForecastSummaryData[];

    case ReportType.APPROVED_CONSOLIDATED_BUDGET:
      return transformers.transformToApprovedConsolidated(forecasts, varianceData, filters) as ApprovedConsolidatedBudgetData[];

    case ReportType.APPROVED_PER_DEPT_BUDGET:
      return transformers.transformToApprovedPerDept(forecasts, varianceData, filters) as ApprovedPerDeptBudgetData[];

    default:
      const _exhaustive: never = reportType;
      return _exhaustive;
  }
}

/**
 * Get all unique departments from forecasts
 */
export function getAvailableDepartments(forecasts: ForecastRow[]): string[] {
  const departments = new Set(forecasts.map((f) => f.department));
  return Array.from(departments).sort();
}

/**
 * Get all unique years from forecasts
 */
export function getAvailableYears(forecasts: ForecastRow[]): number[] {
  const years = new Set(forecasts.map((f) => f.year));
  return Array.from(years).sort((a, b) => b - a); // Most recent first
}

/**
 * Get all unique quarters
 */
export function getAvailableQuarters(): string[] {
  return ['Q1', 'Q2', 'Q3', 'Q4'];
}

/**
 * Get all status options
 */
export function getAvailableStatuses(): Array<'Approved' | 'For Review' | 'Disapproved'> {
  return ['Approved', 'For Review', 'Disapproved'];
}

/**
 * Check if report has data
 */
export function hasReportData(data: ReportData): boolean {
  return Array.isArray(data) && data.length > 0;
}

/**
 * Get CSV headers for a report type
 */
export function getReportHeaders(reportType: ReportType): string[] {
  const headers: Record<ReportType, string[]> = {
    [ReportType.QUARTERLY_VARIANCE]: ['Department', 'Quarter', 'Forecast', 'Actual', 'Variance', 'Variance %', 'Status'],
    [ReportType.QUARTERLY_FORECAST]: ['Department', 'Description', 'Q1', 'Q2', 'Q3', 'Q4', 'Total'],
    [ReportType.ANNUAL_VARIANCE_SUMMARY]: ['Department', 'Total Forecast', 'Total Actual', 'Variance', 'Variance %', 'Status'],
    [ReportType.ANNUAL_FORECAST_SUMMARY]: ['Department', 'Year', 'Q1', 'Q2', 'Q3', 'Q4', 'Total'],
    [ReportType.APPROVED_CONSOLIDATED_BUDGET]: ['Category', 'Department', 'Q1', 'Q2', 'Q3', 'Q4', 'Total'],
    [ReportType.APPROVED_PER_DEPT_BUDGET]: ['Department', 'Category', 'Q1', 'Q2', 'Q3', 'Q4', 'Total'],
  };

  return headers[reportType] || [];
}

/**
 * Transform report data for CSV export
 * Converts numbers to formatted strings for CSV output
 */
export function transformForCSVExport(
  data: ReportData,
  reportType: ReportType
): Record<string, string>[] {
  return (data as any[]).map((row) => {
    const csvRow: Record<string, string> = {};

    Object.entries(row).forEach(([key, value]) => {
      // Handle percentage fields
      if (key === 'percentage') {
        csvRow[key] = typeof value === 'number' ? formatPercentage(value) : String(value);
      }
      // Format currency fields
      else if (
        typeof value === 'number' &&
        (key.includes('q1') ||
          key.includes('q2') ||
          key.includes('q3') ||
          key.includes('q4') ||
          key.includes('total') ||
          key.includes('forecast') ||
          key.includes('actual') ||
          key.includes('proposal'))
      ) {
        csvRow[key] = formatCurrency(value);
      }
      // Format variance as plain number (not currency)
      else if (key === 'variance' && typeof value === 'number') {
        csvRow[key] = value.toLocaleString('en-PH');
      }
      // Everything else as string
      else {
        csvRow[key] = String(value);
      }
    });

    return csvRow;
  });
}
