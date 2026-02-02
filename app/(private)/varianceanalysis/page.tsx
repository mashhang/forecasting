"use client";

import { useForecast } from "@/app/context/ForecastContext";
import { useNotification } from "@/app/context/NotificationContext";
import { useSidebar } from "@/app/context/SidebarContext";
import { useEffect, useState } from "react";

interface VarianceAnalysisRow {
  department: string;
  forecast: number;
  proposal: number;
  variance: number;
  percentage: number;
  status: "Approved" | "For Review" | "Disapproved";
}

export default function VarianceAnalysisPage() {
  const { forecasts, varianceData, setVarianceData, updateVarianceStatus } = useForecast();
  const { addNotification } = useNotification();
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);

  // Wrapper function to update variance status and trigger notifications
  const handleStatusChange = (
    department: string,
    newStatus: "Approved" | "For Review" | "Disapproved"
  ) => {
    // Get the old status for comparison
    const currentRow = varianceData.find((row) => row.department === department);
    const oldStatus = currentRow?.status;

    // Update the status
    updateVarianceStatus(department, newStatus);

    // Generate appropriate notification based on status change
    if (oldStatus !== newStatus) {
      const variancePercent = currentRow?.percentage || 0;

      if (newStatus === "Approved") {
        addNotification(
          "variance_approved",
          `Variance Approved`,
          `${department} variance (${variancePercent}%) has been approved.`,
          {
            department,
            variance: variancePercent,
            status: newStatus,
          }
        );
      } else if (newStatus === "For Review") {
        addNotification(
          "variance_flagged",
          `Variance Flagged for Review`,
          `${department} variance (${variancePercent}%) requires review.`,
          {
            department,
            variance: variancePercent,
            status: newStatus,
          }
        );
      } else if (newStatus === "Disapproved") {
        addNotification(
          "variance_reviewed",
          `Variance Marked as Disapproved`,
          `${department} variance (${variancePercent}%) has been marked as disapproved.`,
          {
            department,
            variance: variancePercent,
            status: newStatus,
          }
        );
      }
    }
  };

  // Generate variance analysis from actual forecasts
  useEffect(() => {
    const generateVarianceAnalysis = () => {
      if (!forecasts || forecasts.length === 0) {
        setVarianceData([]);
        return;
      }

      // Group forecasts by department to get total actual budget and total forecast
      const departmentMap = new Map<string, {
        totalActual: number;
        totalForecast: number;
      }>();

      forecasts.forEach((forecast) => {
        const department = forecast.department || "Unknown";
        const existing = departmentMap.get(department) || {
          totalActual: 0,
          totalForecast: 0,
        };

        departmentMap.set(department, {
          totalActual: existing.totalActual + forecast.total,
          totalForecast: existing.totalForecast + forecast.forecastedTotal,
        });
      });

      // Create variance analysis rows
      const analysis: VarianceAnalysisRow[] = Array.from(
        departmentMap.entries()
      ).map(([department, { totalActual, totalForecast }]) => {
        const proposal = totalActual; // Actual budget from data management
        const forecastValue = totalForecast; // Predicted forecast
        const variance = forecastValue - proposal;
        const percentage = proposal > 0
          ? Math.round((variance / proposal) * 100 * 10) / 10
          : 0;

        // Determine status based on percentage variance
        let status: "Approved" | "For Review" | "Disapproved";
        if (Math.abs(percentage) <= 5) {
          status = "Approved";
        } else if (Math.abs(percentage) <= 15) {
          status = "For Review";
        } else {
          status = "Disapproved";
        }

        return {
          department,
          forecast: forecastValue,
          proposal,
          variance,
          percentage,
          status,
        };
      });

      setVarianceData(analysis);
    };

    generateVarianceAnalysis();
  }, [forecasts, setVarianceData]);

  return (
    <div
      className={`transition-all duration-300 ease-in-out h-screen md:ml-64 md:w-[calc(100%-16rem)] px-20
      `}

      /* ${
          isSidebarOpen
            ? "md:ml-64 md:w-[calc(100%-16rem)] px-20"
            : "md:ml-0 w-full"
        } */
    >
      <div className="mx-auto max-w-[1600px] mt-4">
        <div className="rounded-2xl border bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Variance Analysis</h2>
            <div className="flex gap-2">
              <button className="rounded-xl border px-3 py-2">Export</button>
              <button
                className={`rounded-xl px-3 py-2 ${showFlaggedOnly ? 'bg-[var(--brand-gold)] text-white' : 'bg-[var(--brand-gold)]'}`}
                onClick={() => {
                  setShowFlaggedOnly(!showFlaggedOnly);
                  // Update status of flagged items (>15% variance) to "For Review"
                  varianceData.forEach((row) => {
                    if (Math.abs(row.percentage) > 15 && row.status === "Disapproved") {
                      handleStatusChange(row.department, "For Review");
                    }
                  });
                }}
              >
                Flag &gt; 15%
              </button>
            </div>
          </div>
          <div className="mt-4 overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-3 py-2">Department</th>
                  <th className="px-3 py-2">Forecast</th>
                  <th className="px-3 py-2">Proposal</th>
                  <th className="px-3 py-2">Variance</th>
                  <th className="px-3 py-2">%</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {varianceData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-6 text-center text-gray-500"
                    >
                      No variance analysis data. Please generate a forecast first.
                    </td>
                  </tr>
                ) : (
                  varianceData
                    .filter((row) => !showFlaggedOnly || Math.abs(row.percentage) > 15)
                    .map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-100">
                      <td className="px-3 py-2">{row.department}</td>
                      <td className="px-3 py-2">
                        ₱{(row.forecast / 1000000).toFixed(2)}M
                      </td>
                      <td className="px-3 py-2">
                        ₱{(row.proposal / 1000000).toFixed(2)}M
                      </td>
                      <td className="px-3 py-2">
                        {row.variance >= 0 ? "+" : ""}₱
                        {(Math.abs(row.variance) / 1000000).toFixed(2)}M
                      </td>
                      <td
                        className={`px-3 py-2 font-semibold ${
                          row.status === "Approved"
                            ? "text-green-700"
                            : row.status === "For Review"
                            ? "text-yellow-700"
                            : "text-red-600"
                        }`}
                      >
                        {row.percentage >= 0 ? "+" : ""}
                        {row.percentage}%
                      </td>
                      <td className="px-3 py-2">
                        <select
                          value={row.status}
                          onChange={(e) =>
                            handleStatusChange(
                              row.department,
                              e.target.value as "Approved" | "For Review" | "Disapproved"
                            )
                          }
                          className={`rounded-full px-2 py-1 text-xs border-0 cursor-pointer font-semibold ${
                            row.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : row.status === "For Review"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          <option value="Approved">Approved</option>
                          <option value="For Review">For Review</option>
                          <option value="Disapproved">Disapproved</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
