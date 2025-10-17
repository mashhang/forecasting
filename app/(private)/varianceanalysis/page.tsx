"use client";

import { useSidebar } from "@/app/context/SidebarContext";
import { useState, useEffect } from "react";
import { mockData, type NormalizedRow } from "@/lib/mockData";

interface VarianceAnalysisRow {
  department: string;
  forecast: number;
  proposal: number;
  variance: number;
  percentage: number;
  status: "Approved" | "For Review" | "Disapproved";
}

export default function VarianceAnalysisPage() {
  const { isSidebarOpen } = useSidebar();
  const [varianceData, setVarianceData] = useState<VarianceAnalysisRow[]>([]);

  // Generate variance analysis from mock data
  useEffect(() => {
    const generateVarianceAnalysis = () => {
      // Group data by department
      const departmentTotals = mockData.reduce((acc, row) => {
        if (!acc[row.department]) {
          acc[row.department] = 0;
        }
        acc[row.department] += row.total;
        return acc;
      }, {} as Record<string, number>);

      // Generate variance analysis for each department
      const analysis: VarianceAnalysisRow[] = Object.entries(
        departmentTotals
      ).map(([department, proposal]) => {
        // Generate a realistic forecast (slightly different from proposal)
        const varianceFactor = (Math.random() - 0.5) * 0.3; // ±15% variance
        const forecast = Math.round(proposal * (1 + varianceFactor));
        const variance = forecast - proposal;
        const percentage = Math.round((variance / proposal) * 100 * 10) / 10; // Round to 1 decimal

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
          forecast,
          proposal,
          variance,
          percentage,
          status,
        };
      });

      setVarianceData(analysis);
    };

    generateVarianceAnalysis();
  }, []);

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
              <button className="rounded-xl bg-[var(--brand-gold)] px-3 py-2">
                Flag &gt; 20%
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
                      Loading variance analysis...
                    </td>
                  </tr>
                ) : (
                  varianceData.map((row, idx) => (
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
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            row.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : row.status === "For Review"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {row.status}
                        </span>
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
