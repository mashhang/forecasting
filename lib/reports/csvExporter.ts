// CSV generation and download utilities

import { ReportType, CSVExportOptions } from './types';

/**
 * Converts an array of objects to a CSV string
 * Handles commas, quotes, and special characters properly
 */
export function convertToCSV(
  data: Record<string, any>[],
  headers?: string[],
  inflationRate?: number
): string {
  if (data.length === 0) return '';

  // Use actual object keys if no headers provided
  const objectKeys = Object.keys(data[0]);
  const csvHeaders = headers || objectKeys;

  // Escape CSV values
  const escapeCSVValue = (value: any): string => {
    if (value === null || value === undefined) return '';

    const stringValue = String(value);

    // If value contains comma, quote, or newline, wrap in quotes and escape quotes
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
  };

  // Create metadata row if inflation rate is provided
  const metadataRows: string[] = [];
  if (inflationRate !== undefined) {
    metadataRows.push(`Declared Inflation Rate (NCR),${inflationRate}%`);
    metadataRows.push(''); // Empty row for spacing
  }

  // Create header row
  const headerRow = csvHeaders.map(escapeCSVValue).join(',');

  // Create data rows using actual object keys, not header names
  const dataRows = data.map((row) =>
    objectKeys.map((key) => escapeCSVValue(row[key])).join(',')
  );

  return [...metadataRows, headerRow, ...dataRows].join('\n');
}

/**
 * Triggers a browser download of CSV content
 * Creates a blob, generates a download link, and cleans up after
 */
export function downloadCSV(
  csvContent: string,
  filename: string,
  options?: Pick<CSVExportOptions, 'delimiter'>
): void {
  // Create blob with CSV content and BOM for Excel compatibility
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create temporary download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  // Trigger download
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates a timestamped filename for the report
 */
export function generateFilename(
  reportType: ReportType,
  includeTimestamp: boolean = true
): string {
  const reportNames: Record<ReportType, string> = {
    [ReportType.QUARTERLY_VARIANCE]: 'Quarterly_Variance',
    [ReportType.QUARTERLY_FORECAST]: 'Quarterly_Forecast',
    [ReportType.ANNUAL_VARIANCE_SUMMARY]: 'Annual_Variance_Summary',
    [ReportType.ANNUAL_FORECAST_SUMMARY]: 'Annual_Forecast_Summary',
    [ReportType.APPROVED_CONSOLIDATED_BUDGET]: 'Approved_Consolidated_Budget',
    [ReportType.APPROVED_PER_DEPT_BUDGET]: 'Approved_Per_Department_Budget',
  };

  const baseName = reportNames[reportType];
  const timestamp = includeTimestamp
    ? `_${new Date().toISOString().split('T')[0]}_${new Date().getHours()}-${new Date().getMinutes()}`
    : '';

  return `${baseName}${timestamp}.csv`;
}

/**
 * Formats a number as currency (Philippine Peso)
 * Example: 1234567.89 → ₱1,234,567.89
 */
export function formatCurrency(value: number): string {
  // Format with PHP currency
  const formatted = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  // Replace "PHP" text with ₱ symbol if present, otherwise just return as-is
  // This handles both "PHP 1,234.56" and "₱1,234.56" formats
  if (formatted.includes('PHP')) {
    return formatted.replace('PHP', '₱').trim();
  }

  return formatted.trim();
}

/**
 * Formats a number as percentage with sign
 * Example: 5.5 → +5.5%, -3.2 → -3.2%
 */
export function formatPercentage(value: number, decimalPlaces: number = 1): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimalPlaces)}%`;
}

/**
 * Formats a number with locale-specific formatting
 * Example: 1234567.89 → 1,234,567.89
 */
export function formatNumber(value: number, decimalPlaces: number = 2): string {
  return new Intl.NumberFormat('en-PH', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value);
}

/**
 * Exports data as CSV and triggers download
 * Main utility function combining conversion and download
 */
export function exportAsCSV(
  data: Record<string, any>[],
  reportType: ReportType,
  headers?: string[],
  options?: CSVExportOptions,
  inflationRate?: number
): void {
  if (data.length === 0) {
    throw new Error('No data to export');
  }

  const csvContent = convertToCSV(data, headers, inflationRate);
  const filename = options?.filename || generateFilename(reportType, options?.includeTimestamp !== false);

  downloadCSV(csvContent, filename, options);
}
