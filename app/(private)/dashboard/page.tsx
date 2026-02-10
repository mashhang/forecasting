"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useForecast } from "@/app/context/ForecastContext";
import { useSettings } from "@/app/context/SettingsContext";
import { useSidebar } from "@/app/context/SidebarContext";
import getApiUrl from "@/lib/getApiUrl";
import React, { useEffect, useState } from "react";
// import API_URL from "@/lib/getApiUrl"; // COMMENTED OUT - Using mock data instead
import { getMockSummary, mockData, type NormalizedRow } from "@/lib/mockData";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const { isSidebarOpen } = useSidebar();
  const { forecasts, varianceData } = useForecast();
  const { settings } = useSettings();
  const { user } = useAuth();
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [uploadedData, setUploadedData] = useState<NormalizedRow[]>([]);
  const [dashboardData, setDashboardData] = useState({
    totalBudget: 0,
    budgetProgress: 0,
    yearOverYearTrend: 0,
    departments: [] as string[],
    departmentSpending: [] as { department: string; spending: number }[],
    varianceItems: [] as any[],
    varianceThreshold: 15,
    quarterlyTrends: [] as { quarter: string; total: number }[],
    categories: [] as { category: string; count: number; total: number }[],
    topItems: [] as {
      description: string;
      total: number;
      department: string;
    }[],
  });

  // Fetch uploaded data from database
  useEffect(() => {
    if (!user?.id) return;

    const fetchUploadedData = async () => {
      try {
        const res = await fetch(`${getApiUrl()}/api/file/rows/${user.id}`);
        const data = await res.json();
        setUploadedData(data.rows || []);
      } catch (err) {
        console.error("Failed to fetch uploaded data:", err);
      }
    };

    fetchUploadedData();
  }, [user?.id]);

  useEffect(() => {
    // Use forecasts if available, otherwise use uploaded data
    const dataToUse = forecasts && forecasts.length > 0 ? forecasts : uploadedData;

    // Calculate comprehensive statistics from actual data
    if (!dataToUse || dataToUse.length === 0) {
      setDashboardData({
        totalBudget: 0,
        budgetProgress: 0,
        yearOverYearTrend: 0,
        departments: [],
        departmentSpending: [],
        varianceItems: [],
        varianceThreshold: settings?.variancePercentage || 15,
        quarterlyTrends: [],
        categories: [],
        topItems: [],
      });
      return;
    }

    // Get unique years from data
    const years = [...new Set(dataToUse.map((row) => row.year))].sort().reverse();
    const currentYear = years[0] || new Date().getFullYear();
    const previousYear = years[1];

    // Filter to current year and previous year
    const currentYearData = dataToUse.filter((row) => row.year === currentYear);
    const previousYearData = previousYear ? dataToUse.filter((row) => row.year === previousYear) : [];

    const totalBudget = currentYearData.reduce((sum, row) => sum + row.total, 0);
    const departments = [...new Set(currentYearData.map((row) => row.department))];

    const departmentSpending = departments
      .map((dept) => {
        const spending = currentYearData
          .filter((row) => row.department === dept)
          .reduce((sum, row) => sum + row.total, 0);
        return { department: dept, spending };
      })
      .sort((a, b) => b.spending - a.spending);

    // Use varianceData from ForecastContext and filter by variance threshold
    const varianceThreshold = settings?.variancePercentage || 15;
    const varianceItems = varianceData.filter(
      (row) => Math.abs(row.percentage) > varianceThreshold
    );

    // Calculate budget progress (assuming Q1-Q4 is 1/4 through the year per quarter)
    const q1Total = currentYearData.reduce((sum, row) => sum + row.q1, 0);
    const q2Total = currentYearData.reduce((sum, row) => sum + row.q2, 0);
    const totalSpentToDate = q1Total + q2Total;
    const budgetProgress = Math.min(
      (totalSpentToDate / totalBudget) * 100,
      100
    );

    // Calculate actual YoY trend comparing current year vs previous year
    const previousYearTotal = previousYearData.reduce((sum, row) => sum + row.total, 0);
    const yearOverYearTrend =
      previousYearTotal > 0
        ? Math.round(((totalBudget - previousYearTotal) / previousYearTotal) * 1000) / 10
        : 0;

    // Calculate quarterly trends
    const quarterlyTrends = [
      { quarter: "Q1", total: currentYearData.reduce((sum, row) => sum + row.q1, 0) },
      { quarter: "Q2", total: currentYearData.reduce((sum, row) => sum + row.q2, 0) },
      { quarter: "Q3", total: currentYearData.reduce((sum, row) => sum + row.q3, 0) },
      { quarter: "Q4", total: currentYearData.reduce((sum, row) => sum + row.q4, 0) },
    ];

    // Calculate category statistics
    const categoryMap = currentYearData.reduce((acc, row) => {
      if (!acc[row.category]) {
        acc[row.category] = { count: 0, total: 0 };
      }
      acc[row.category].count++;
      acc[row.category].total += row.total;
      return acc;
    }, {} as Record<string, { count: number; total: number }>);

    const categories = Object.entries(categoryMap)
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.total - a.total);

    // Top spending items
    const topItems = currentYearData
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map((row) => ({
        description: row.description,
        total: row.total,
        department: row.department,
      }));

    setDashboardData({
      totalBudget,
      budgetProgress,
      yearOverYearTrend,
      departments,
      departmentSpending,
      varianceItems,
      varianceThreshold,
      quarterlyTrends,
      categories,
      topItems,
    });
  }, [forecasts, uploadedData, varianceData, settings]);

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
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-4">
            <div className="text-sm text-gray-500">Total Budget (2024)</div>
            <div className="mt-2 text-2xl font-bold">
              ₱ {(dashboardData.totalBudget / 1000000).toFixed(1)}M
            </div>
            <div className="mt-3 h-2 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-[var(--brand-gold)] transition-all"
                style={{
                  width: `${Math.min(dashboardData.budgetProgress, 100)}%`,
                }}
              ></div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              ↑ {dashboardData.yearOverYearTrend.toFixed(1)}% vs last year
            </div>
          </div>
          <div className="rounded-2xl border bg-white p-4">
            <div className="text-sm text-gray-500">Departments</div>
            <div className="mt-2 text-2xl font-bold">
              {dashboardData.departments.length}
            </div>
          </div>
          <div className="rounded-2xl border bg-white p-4">
            <div className="text-sm text-gray-500">Variance Watchlist</div>
            <div className="mt-2 text-2xl font-bold">
              {dashboardData.varianceItems.length}
            </div>
            <p className="text-xs text-gray-500">
              Items deviating ≥ {dashboardData.varianceThreshold}% from average
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Quarterly Spending Trends</h2>
            <div className="flex gap-2">
              <button
                className={`rounded-xl px-3 py-1.5 text-sm ${
                  chartType === "line"
                    ? "bg-[var(--brand-green)] text-white"
                    : "border"
                }`}
                onClick={() => setChartType("line")}
              >
                Line
              </button>
              <button
                className={`rounded-xl px-3 py-1.5 text-sm ${
                  chartType === "bar"
                    ? "bg-[var(--brand-green)] text-white"
                    : "border"
                }`}
                onClick={() => setChartType("bar")}
              >
                Bar
              </button>
            </div>
          </div>

          {/*  Real Chart  */}
          <div className="h-64">
            {dashboardData.quarterlyTrends.length > 0 && (
              <>
                {chartType === "line" ? (
                  <Line
                    data={{
                      labels: dashboardData.quarterlyTrends.map(
                        (trend) => trend.quarter
                      ),
                      datasets: [
                        {
                          label: "Total Spending (₱M)",
                          data: dashboardData.quarterlyTrends.map(
                            (trend) => trend.total
                          ),
                          borderColor: "rgb(34, 197, 94)",
                          backgroundColor: "rgba(34, 197, 94, 0.1)",
                          borderWidth: 3,
                          fill: true,
                          tension: 0.4,
                          pointBackgroundColor: "rgb(34, 197, 94)",
                          pointBorderColor: "rgb(34, 197, 94)",
                          pointRadius: 6,
                          pointHoverRadius: 8,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: true,
                          position: "top" as const,
                          labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                              size: 12,
                              family: "Inter, sans-serif",
                            },
                            color: "#374151",
                          },
                        },
                        title: {
                          display: true,
                          text: "",
                          font: {
                            size: 14,
                            weight: "bold" as const,
                            family: "Inter, sans-serif",
                          },
                          color: "#374151",
                          padding: {
                            top: 10,
                            bottom: 20,
                          },
                        },
                        tooltip: {
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                          titleColor: "#ffffff",
                          bodyColor: "#ffffff",
                          borderColor: "#e5e7eb",
                          borderWidth: 1,
                          cornerRadius: 8,
                          callbacks: {
                            label: function (context: any) {
                              const value = context.parsed.y;
                              return `Spending: ₱${(value / 1000000).toFixed(
                                1
                              )}M`;
                            },
                          },
                        },
                      },
                      scales: {
                        x: {
                          grid: {
                            display: false,
                          },
                          ticks: {
                            font: {
                              size: 12,
                              family: "Inter, sans-serif",
                            },
                            color: "#6b7280",
                          },
                        },
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: "rgba(0, 0, 0, 0.1)",
                          },
                          ticks: {
                            font: {
                              size: 12,
                              family: "Inter, sans-serif",
                            },
                            color: "#6b7280",
                            callback: function (value: any) {
                              return `₱${(value / 1000000).toFixed(1)}M`;
                            },
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <Bar
                    data={{
                      labels: dashboardData.quarterlyTrends.map(
                        (trend) => trend.quarter
                      ),
                      datasets: [
                        {
                          label: "Total Spending (₱M)",
                          data: dashboardData.quarterlyTrends.map(
                            (trend) => trend.total
                          ),
                          backgroundColor: "rgba(34, 197, 94, 0.8)",
                          borderColor: "rgb(34, 197, 94)",
                          borderWidth: 1,
                          borderRadius: 4,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: true,
                          position: "top" as const,
                          labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                              size: 12,
                              family: "Inter, sans-serif",
                            },
                            color: "#374151",
                          },
                        },
                        title: {
                          display: true,
                          text: "",
                          font: {
                            size: 14,
                            weight: "bold" as const,
                            family: "Inter, sans-serif",
                          },
                          color: "#374151",
                          padding: {
                            top: 10,
                            bottom: 20,
                          },
                        },
                        tooltip: {
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                          titleColor: "#ffffff",
                          bodyColor: "#ffffff",
                          borderColor: "#e5e7eb",
                          borderWidth: 1,
                          cornerRadius: 8,
                          callbacks: {
                            label: function (context: any) {
                              const value = context.parsed.y;
                              return `Spending: ₱${(value / 1000000).toFixed(
                                1
                              )}M`;
                            },
                          },
                        },
                      },
                      scales: {
                        x: {
                          grid: {
                            display: false,
                          },
                          ticks: {
                            font: {
                              size: 12,
                              family: "Inter, sans-serif",
                            },
                            color: "#6b7280",
                          },
                        },
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: "rgba(0, 0, 0, 0.1)",
                          },
                          ticks: {
                            font: {
                              size: 12,
                              family: "Inter, sans-serif",
                            },
                            color: "#6b7280",
                            callback: function (value: any) {
                              return `₱${(value / 1000000).toFixed(1)}M`;
                            },
                          },
                        },
                      },
                    }}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Additional Quarterly Data Display */}
        <div className="mt-4 rounded-2xl border bg-white p-4">
          <h3 className="text-lg font-semibold mb-4">
            Quarterly Spending Breakdown
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {dashboardData.quarterlyTrends.map((trend, index) => (
              <div
                key={index}
                className="rounded-xl bg-gray-50 p-3 text-center"
              >
                <div className="text-sm text-gray-500">{trend.quarter}</div>
                <div className="mt-1 text-lg font-bold">
                  ₱{(trend.total / 1000000).toFixed(1)}M
                </div>
                <div className="mt-1 h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-[var(--brand-green)]"
                    style={{
                      width: `${
                        (trend.total /
                          Math.max(
                            ...dashboardData.quarterlyTrends.map((t) => t.total)
                          )) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-4">
            <h3 className="font-semibold">Top Departments by Spend</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {dashboardData.departmentSpending
                .slice(0, 3)
                .map((dept, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{dept.department}</span>
                    <span className="font-semibold">
                      ₱{(dept.spending / 1000000).toFixed(1)}M
                    </span>
                  </li>
                ))}
            </ul>
          </div>
          <div className="rounded-2xl border bg-white p-4">
            <h3 className="font-semibold">Top Spending Items</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {dashboardData.topItems.slice(0, 3).map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span
                    className="truncate max-w-[120px]"
                    title={item.description}
                  >
                    {item.description}
                  </span>
                  <span className="font-semibold text-xs">
                    ₱{(item.total / 1000).toFixed(0)}k
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border bg-white p-4">
            <h3 className="font-semibold">Budget Categories</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {dashboardData.categories.slice(0, 3).map((category, index) => (
                <li key={index} className="flex justify-between">
                  <span>{category.category}</span>
                  <span className="font-semibold">
                    ₱{(category.total / 1000000).toFixed(1)}M
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
