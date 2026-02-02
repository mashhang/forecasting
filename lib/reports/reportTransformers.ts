// Data transformation functions for report generation
// Pure functions with no side effects

import { ForecastRow } from '../mockData';
import { VarianceAnalysisRow } from '@/app/context/ForecastContext';
import {
  QuarterlyVarianceData,
  QuarterlyForecastData,
  AnnualVarianceSummaryData,
  AnnualForecastSummaryData,
  ApprovedConsolidatedBudgetData,
  ApprovedPerDeptBudgetData,
  ReportFilters,
} from './types';

/**
 * Calculate variance percentage
 * @returns percentage value (e.g., 5.5 for 5.5%)
 */
function calculateVariancePercentage(forecast: number, actual: number): number {
  if (forecast === 0) return 0;
  return Math.abs((forecast - actual) / forecast) * 100;
}

/**
 * Determine status based on variance percentage
 * ≤5% = Approved, ≤15% = For Review, >15% = Disapproved
 */
function getStatusFromVariance(percentage: number): 'Approved' | 'For Review' | 'Disapproved' {
  if (percentage <= 5) return 'Approved';
  if (percentage <= 15) return 'For Review';
  return 'Disapproved';
}

/**
 * Transform forecasts to quarterly variance report
 * Groups by department and quarter
 */
export function transformToQuarterlyVariance(
  forecasts: ForecastRow[],
  filters?: ReportFilters
): QuarterlyVarianceData[] {
  const quarterMap = {
    q1: 'Q1',
    q2: 'Q2',
    q3: 'Q3',
    q4: 'Q4',
  } as const;

  const data: QuarterlyVarianceData[] = [];

  // Group by department
  const departmentMap = new Map<string, ForecastRow[]>();
  forecasts.forEach((forecast) => {
    const dept = forecast.department;
    if (!departmentMap.has(dept)) {
      departmentMap.set(dept, []);
    }
    departmentMap.get(dept)!.push(forecast);
  });

  // Process each department and quarter
  departmentMap.forEach((rows, department) => {
    // Filter by department if specified
    if (filters?.department && filters.department !== department) {
      return;
    }

    // Sum by quarter across all categories for this department
    const quarterTotals = { q1: 0, q2: 0, q3: 0, q4: 0 };
    const forecastedTotals = { q1: 0, q2: 0, q3: 0, q4: 0 };

    rows.forEach((row) => {
      (Object.keys(quarterTotals) as Array<keyof typeof quarterTotals>).forEach((q) => {
        quarterTotals[q] += row[q];
        const forecastKey = `forecasted${q.toUpperCase()}` as keyof ForecastRow;
        forecastedTotals[q] += (row[forecastKey] as number) || 0;
      });
    });

    // Create a row for each quarter
    (Object.entries(quarterTotals) as Array<[keyof typeof quarterTotals, number]>).forEach(
      ([quarter, actual]) => {
        const quarterStr = quarterMap[quarter];

        // Filter by quarter if specified
        if (filters?.quarter && filters.quarter !== quarterStr) {
          return;
        }

        const forecast = forecastedTotals[quarter];
        const variance = forecast - actual;
        const percentage = calculateVariancePercentage(forecast, actual);
        const status = getStatusFromVariance(percentage);

        // Filter by status if specified
        if (filters?.status && filters.status !== status) {
          return;
        }

        data.push({
          department,
          quarter: quarterStr,
          forecast,
          actual,
          variance,
          percentage,
          status,
        });
      }
    );
  });

  return data;
}

/**
 * Transform forecasts to quarterly forecast report
 * Shows forecasted values per quarter per department
 */
export function transformToQuarterlyForecast(
  forecasts: ForecastRow[],
  filters?: ReportFilters
): QuarterlyForecastData[] {
  const data: QuarterlyForecastData[] = [];
  const departmentMap = new Map<string, ForecastRow[]>();

  forecasts.forEach((forecast) => {
    const dept = forecast.department;
    if (!departmentMap.has(dept)) {
      departmentMap.set(dept, []);
    }
    departmentMap.get(dept)!.push(forecast);
  });

  departmentMap.forEach((rows, department) => {
    // Filter by department if specified
    if (filters?.department && filters.department !== department) {
      return;
    }

    let q1 = 0,
      q2 = 0,
      q3 = 0,
      q4 = 0;

    rows.forEach((row) => {
      q1 += row.forecastedQ1 || 0;
      q2 += row.forecastedQ2 || 0;
      q3 += row.forecastedQ3 || 0;
      q4 += row.forecastedQ4 || 0;
    });

    const total = q1 + q2 + q3 + q4;

    data.push({
      department,
      description: `${department} Department Forecast`,
      q1,
      q2,
      q3,
      q4,
      total,
    });
  });

  return data;
}

/**
 * Transform forecasts to annual variance summary
 * Aggregates all quarters to annual totals by department
 */
export function transformToAnnualVarianceSummary(
  forecasts: ForecastRow[],
  varianceData: VarianceAnalysisRow[],
  filters?: ReportFilters
): AnnualVarianceSummaryData[] {
  const data: AnnualVarianceSummaryData[] = [];

  // Use variance data which already has annual calculations
  varianceData.forEach((variance) => {
    // Filter by department if specified
    if (filters?.department && filters.department !== variance.department) {
      return;
    }

    // Filter by status if specified
    if (filters?.status && filters.status !== variance.status) {
      return;
    }

    data.push({
      department: variance.department,
      totalForecast: variance.forecast,
      totalActual: variance.proposal,
      variance: variance.variance,
      percentage: variance.percentage,
      status: variance.status,
    });
  });

  return data;
}

/**
 * Transform forecasts to annual forecast summary
 * Sums all quarters per department
 */
export function transformToAnnualForecastSummary(
  forecasts: ForecastRow[],
  filters?: ReportFilters
): AnnualForecastSummaryData[] {
  const data: AnnualForecastSummaryData[] = [];
  const departmentMap = new Map<string, ForecastRow[]>();
  const yearSet = new Set<number>();

  forecasts.forEach((forecast) => {
    const dept = forecast.department;
    if (!departmentMap.has(dept)) {
      departmentMap.set(dept, []);
    }
    departmentMap.get(dept)!.push(forecast);
    yearSet.add(forecast.year);
  });

  // Get the year from filters or use latest
  const year = filters?.year || Math.max(...Array.from(yearSet));

  departmentMap.forEach((rows, department) => {
    // Filter by department if specified
    if (filters?.department && filters.department !== department) {
      return;
    }

    let q1 = 0,
      q2 = 0,
      q3 = 0,
      q4 = 0;

    rows.forEach((row) => {
      if (row.year === year) {
        q1 += row.forecastedQ1 || 0;
        q2 += row.forecastedQ2 || 0;
        q3 += row.forecastedQ3 || 0;
        q4 += row.forecastedQ4 || 0;
      }
    });

    const total = q1 + q2 + q3 + q4;

    if (total > 0) {
      data.push({
        department,
        year,
        q1,
        q2,
        q3,
        q4,
        total,
      });
    }
  });

  return data;
}

/**
 * Transform to approved consolidated budget
 * Shows only approved departments, consolidated across all categories
 */
export function transformToApprovedConsolidated(
  forecasts: ForecastRow[],
  varianceData: VarianceAnalysisRow[],
  filters?: ReportFilters
): ApprovedConsolidatedBudgetData[] {
  const data: ApprovedConsolidatedBudgetData[] = [];

  // Get list of approved departments
  const approvedDepts = new Set(
    varianceData.filter((v) => v.status === 'Approved').map((v) => v.department)
  );

  // Group by department and category
  const consolidated = new Map<string, Map<string, { q1: number; q2: number; q3: number; q4: number }>>();

  forecasts.forEach((forecast) => {
    // Only include approved departments
    if (!approvedDepts.has(forecast.department)) {
      return;
    }

    // Filter by department if specified
    if (filters?.department && filters.department !== forecast.department) {
      return;
    }

    if (!consolidated.has(forecast.category)) {
      consolidated.set(forecast.category, new Map());
    }

    const categoryMap = consolidated.get(forecast.category)!;
    if (!categoryMap.has(forecast.department)) {
      categoryMap.set(forecast.department, { q1: 0, q2: 0, q3: 0, q4: 0 });
    }

    const dept = categoryMap.get(forecast.department)!;
    dept.q1 += forecast.forecastedQ1 || 0;
    dept.q2 += forecast.forecastedQ2 || 0;
    dept.q3 += forecast.forecastedQ3 || 0;
    dept.q4 += forecast.forecastedQ4 || 0;
  });

  consolidated.forEach((categoryMap, category) => {
    categoryMap.forEach((quarters, department) => {
      const total = quarters.q1 + quarters.q2 + quarters.q3 + quarters.q4;

      data.push({
        category,
        department,
        q1: quarters.q1,
        q2: quarters.q2,
        q3: quarters.q3,
        q4: quarters.q4,
        total,
      });
    });
  });

  // Sort by category then department for consistent output
  data.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.department.localeCompare(b.department);
  });

  return data;
}

/**
 * Transform to approved per-department budget
 * Shows approved departments with category breakdown
 */
export function transformToApprovedPerDept(
  forecasts: ForecastRow[],
  varianceData: VarianceAnalysisRow[],
  filters?: ReportFilters
): ApprovedPerDeptBudgetData[] {
  const data: ApprovedPerDeptBudgetData[] = [];

  // Get list of approved departments
  const approvedDepts = new Set(
    varianceData.filter((v) => v.status === 'Approved').map((v) => v.department)
  );

  forecasts.forEach((forecast) => {
    // Only include approved departments
    if (!approvedDepts.has(forecast.department)) {
      return;
    }

    // Filter by department if specified
    if (filters?.department && filters.department !== forecast.department) {
      return;
    }

    const q1 = forecast.forecastedQ1 || 0;
    const q2 = forecast.forecastedQ2 || 0;
    const q3 = forecast.forecastedQ3 || 0;
    const q4 = forecast.forecastedQ4 || 0;
    const total = q1 + q2 + q3 + q4;

    data.push({
      department: forecast.department,
      category: forecast.category,
      q1,
      q2,
      q3,
      q4,
      total,
    });
  });

  // Sort by department then category for consistent output
  data.sort((a, b) => {
    if (a.department !== b.department) {
      return a.department.localeCompare(b.department);
    }
    return a.category.localeCompare(b.category);
  });

  return data;
}
