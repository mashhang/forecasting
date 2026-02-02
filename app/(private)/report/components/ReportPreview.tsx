'use client';

import { ReportType } from '@/lib/reports/types';
import type { ReportData } from '@/lib/reports/types';
import { getReportHeaders } from '@/lib/reports/reportGenerators';
import { formatCurrency, formatPercentage } from '@/lib/reports/csvExporter';

interface ReportPreviewProps {
  reportType: ReportType;
  data: ReportData;
  isLoading?: boolean;
}

export default function ReportPreview({
  reportType,
  data,
  isLoading = false,
}: ReportPreviewProps) {
  const headers = getReportHeaders(reportType);
  const rows = Array.isArray(data) ? data : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-green)]"></div>
          <p className="mt-4 text-gray-600">Generating report...</p>
        </div>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
        <div className="text-center">
          <p className="text-gray-600 mb-2">No data available for this report</p>
          <p className="text-sm text-gray-500">Try adjusting your filters or generate forecast data first</p>
        </div>
      </div>
    );
  }

  /**
   * Format cell value based on header name and value type
   */
  const formatCellValue = (value: any, headerName: string): string => {
    if (value === null || value === undefined) return '';

    // Format percentages
    if (headerName.includes('%') || headerName.includes('Variance %')) {
      if (typeof value === 'number') {
        return formatPercentage(value);
      }
      return String(value);
    }

    // Format currency values
    if (
      headerName.includes('Q1') ||
      headerName.includes('Q2') ||
      headerName.includes('Q3') ||
      headerName.includes('Q4') ||
      headerName.includes('Total') ||
      headerName.includes('Forecast') ||
      headerName.includes('Actual') ||
      headerName.includes('Variance') ||
      headerName.includes('Proposal')
    ) {
      if (typeof value === 'number' && headerName !== 'Variance %' && !String(value).includes('%')) {
        return formatCurrency(value);
      }
    }

    // Format status with colors
    if (headerName === 'Status') {
      return String(value);
    }

    return String(value);
  };

  /**
   * Get status badge color
   */
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'For Review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Disapproved':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold text-[var(--brand-ink)]">{rows.length}</span> rows
        </p>
      </div>

      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left font-semibold text-[var(--brand-ink)] whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b hover:bg-gray-50 transition-colors duration-200"
              >
                {headers.map((header, colIndex) => {
                  // Map header to data key with special case handling
                  const keyMapping: Record<string, string> = {
                    'variance %': 'percentage',
                    'total forecast': 'totalForecast',
                    'total actual': 'totalActual',
                    'description': 'description',
                    'department': 'department',
                    'category': 'category',
                    'quarter': 'quarter',
                    'year': 'year',
                    'status': 'status',
                    'q1': 'q1',
                    'q2': 'q2',
                    'q3': 'q3',
                    'q4': 'q4',
                    'total': 'total',
                    'forecast': 'forecast',
                    'actual': 'actual',
                    'variance': 'variance',
                    'proposal': 'proposal',
                  };

                  const lowerHeader = header.toLowerCase();
                  let dataKey = keyMapping[lowerHeader];

                  // Fallback: try to find key by camelCase conversion
                  if (!dataKey) {
                    dataKey = Object.keys(row).find(
                      (key) =>
                        key.replace(/([A-Z])/g, ' $1').trim().toLowerCase() ===
                        lowerHeader
                    ) || lowerHeader;
                  }

                  const value = (row as any)[dataKey];
                  const isStatusCol = header === 'Status';

                  return (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 text-[var(--brand-ink)] whitespace-nowrap ${
                        isStatusCol ? '' : ''
                      }`}
                    >
                      {isStatusCol ? (
                        <span
                          className={`inline-block px-3 py-1 rounded-lg border text-xs font-semibold ${getStatusColor(
                            value
                          )}`}
                        >
                          {value}
                        </span>
                      ) : (
                        formatCellValue(value, header)
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
