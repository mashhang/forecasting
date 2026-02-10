"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useForecast } from "@/app/context/ForecastContext";
import { useSidebar } from "@/app/context/SidebarContext";
import { useSettings } from "@/app/context/SettingsContext";
import { exportAsCSV } from "@/lib/reports/csvExporter";
import getApiUrl from "@/lib/getApiUrl";
import {
  REPORT_CONFIGS,
  generateReport,
  getAvailableDepartments,
  getAvailableYears,
  getReportHeaders,
  hasReportData,
  transformForCSVExport,
} from "@/lib/reports/reportGenerators";
import { ReportData, ReportFilters, ReportType } from "@/lib/reports/types";
import { useEffect, useState } from "react";
import ReportFiltersComponent from "./components/ReportFilters";
import ReportPreview from "./components/ReportPreview";
import ReportSelector from "./components/ReportSelector";

const logEvent = async (
  message: string,
  level: "INFO" | "WARN" | "ERROR" = "INFO",
  userName?: string
) => {
  try {
    await fetch(`${getApiUrl()}/api/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, level, userName }),
    });
  } catch (err) {
    console.error("Failed to log event:", err);
  }
};

export default function ReportGenerationPage() {
  const { isSidebarOpen } = useSidebar();
  const { forecasts, varianceData } = useForecast();
  const { settings } = useSettings();
  const { user } = useAuth();

  // State management
  const [selectedReportType, setSelectedReportType] = useState<ReportType>(
    ReportType.QUARTERLY_VARIANCE
  );
  const [filters, setFilters] = useState<ReportFilters>({});
  const [previewData, setPreviewData] = useState<ReportData>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get available options for filters
  const availableDepartments = getAvailableDepartments(forecasts);
  const availableYears = getAvailableYears(forecasts);
  const reportConfig = REPORT_CONFIGS[selectedReportType];

  // Auto-generate preview when report type or filters change
  useEffect(() => {
    const generatePreview = async () => {
      setError(null);

      if (forecasts.length === 0) {
        setError(
          "No forecast data available. Please generate forecasts first in the Forecasting section."
        );
        setPreviewData([]);
        return;
      }

      try {
        setIsGenerating(true);
        // Simulate async operation for better UX
        await new Promise((resolve) => setTimeout(resolve, 300));

        const data = generateReport(selectedReportType, forecasts, varianceData, filters);

        if (!hasReportData(data)) {
          setError("No data matches the current filters. Try adjusting them.");
        }

        setPreviewData(data);

        // Log report generation
        if (hasReportData(data)) {
          await logEvent(
            `Generated report: ${selectedReportType} with ${data.length} rows`,
            "INFO",
            user?.name
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate report");
        setPreviewData([]);
      } finally {
        setIsGenerating(false);
      }
    };

    generatePreview();
  }, [selectedReportType, filters, forecasts, varianceData]);

  // Handle report type change - reset filters
  const handleReportTypeChange = (type: ReportType) => {
    setSelectedReportType(type);
    setFilters({}); // Reset filters when changing report type
  };

  // Handle CSV export
  const handleExportCSV = async () => {
    try {
      if (!hasReportData(previewData)) {
        setError("No data to export");
        return;
      }

      const csvData = transformForCSVExport(previewData, selectedReportType);
      const headers = getReportHeaders(selectedReportType);
      const inflationRate = settings?.inflationRate || 3.5;

      exportAsCSV(csvData, selectedReportType, headers, undefined, inflationRate);

      // Log the export event
      await logEvent(
        `Exported report as CSV: ${selectedReportType} with ${previewData.length} rows`,
        "INFO",
        user?.name
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export CSV");
    }
  };

  return (
    <div
      className={`transition-all duration-300 ease-in-out md:ml-64 md:w-[calc(100%-16rem)] px-20`}
    >
      <div className="mx-auto max-w-[1600px] mt-4 pb-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-[var(--brand-ink)]">Report Generation</h1>
            <p className="text-gray-600 mt-2">
              Generate and export reports from your forecast data
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Controls Section */}
          <div className="grid gap-6 lg:grid-cols-3 bg-white rounded-2xl border p-6">
            <div className="lg:col-span-3">
              <h2 className="text-lg font-semibold text-[var(--brand-ink)] mb-4">
                Report Configuration
              </h2>
            </div>

            {/* Report Type Selector */}
            <div className="lg:col-span-3">
              <ReportSelector
                selectedType={selectedReportType}
                onTypeChange={handleReportTypeChange}
              />
            </div>

            {/* Filters */}
            <div className="lg:col-span-3">
              <h3 className="text-sm font-semibold text-[var(--brand-ink)] mb-4">Filters</h3>
              <ReportFiltersComponent
                config={reportConfig}
                filters={filters}
                onFiltersChange={setFilters}
                availableDepartments={availableDepartments}
                availableYears={availableYears}
              />
            </div>

            {/* Action Buttons */}
            <div className="lg:col-span-3 flex gap-3 pt-4 border-t">
              <button
                onClick={handleExportCSV}
                disabled={!hasReportData(previewData) || isGenerating}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--brand-green)] text-white font-semibold transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Export as CSV
              </button>

              {/* Placeholder for future PDF/Excel exports */}
              <button
                disabled
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-500 font-semibold transition-all duration-300 opacity-50 cursor-not-allowed"
                title="PDF export coming soon"
              >
                Export as PDF
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-2xl border p-6">
            <h2 className="text-lg font-semibold text-[var(--brand-ink)] mb-4">
              Report Preview
            </h2>
            <ReportPreview
              reportType={selectedReportType}
              data={previewData}
              isLoading={isGenerating}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
