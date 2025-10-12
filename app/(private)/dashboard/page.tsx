"use client";

import React, { useEffect, useState } from "react";
import { useSidebar } from "@/app/context/SidebarContext";
// import API_URL from "@/lib/getApiUrl"; // COMMENTED OUT - Using mock data instead
import { mockData } from "@/lib/mockData";

export default function Dashboard() {
  const { isSidebarOpen } = useSidebar();

  // Calculate statistics from mock data
  const totalBudget = mockData.reduce((sum, row) => sum + row.total, 0);
  const departments = [...new Set(mockData.map((row) => row.department))];
  const departmentSpending = departments
    .map((dept) => {
      const spending = mockData
        .filter((row) => row.department === dept)
        .reduce((sum, row) => sum + row.total, 0);
      return { department: dept, spending };
    })
    .sort((a, b) => b.spending - a.spending);

  // Mock variance calculation (items with >15% variance)
  const varianceItems = mockData.filter((row) => {
    const avgQuarterly = row.total / 4;
    const maxQuarter = Math.max(row.q1, row.q2, row.q3, row.q4);
    const variance = Math.abs((maxQuarter - avgQuarterly) / avgQuarterly);
    return variance > 0.15; // 15% threshold
  });

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
              ₱ {(totalBudget / 1000000).toFixed(1)}M
            </div>
            <div className="mt-3 h-2 rounded-full bg-gray-100">
              <div className="h-2 w-3/5 rounded-full bg-[var(--brand-gold)]"></div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              ↑ 5.2% vs last year
            </div>
          </div>
          <div className="rounded-2xl border bg-white p-4">
            <div className="text-sm text-gray-500">Active Departments</div>
            <div className="mt-2 text-2xl font-bold">{departments.length}</div>
            <div className="mt-3 flex gap-2">
              <span className="rounded-full bg-[var(--brand-green)]/10 px-2 py-1 text-xs text-[var(--brand-green)]">
                Active
              </span>
              <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
                {departments.length - 1} pending
              </span>
            </div>
          </div>
          <div className="rounded-2xl border bg-white p-4">
            <div className="text-sm text-gray-500">Variance Watchlist</div>
            <div className="mt-2 text-2xl font-bold">
              {varianceItems.length}
            </div>
            <p className="text-xs text-gray-500">
              Items deviating ≥ 15% from average
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Quarterly Trend (Mock Chart)
            </h2>
            <div className="flex gap-2">
              <button className="rounded-xl border px-3 py-1.5 text-sm">
                QTD
              </button>
              <button className="rounded-xl border bg-[var(--brand-green)] px-3 py-1.5 text-sm text-white">
                1Y
              </button>
              <button className="rounded-xl border px-3 py-1.5 text-sm">
                3Y
              </button>
            </div>
          </div>

          {/*  Chart placeholder  */}
          <div className="mt-4 grid h-48 place-items-center rounded-xl bg-gradient-to-b from-gray-50 to-gray-100 text-gray-400">
            Line/Bar Chart Placeholder
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-4">
            <h3 className="font-semibold">Top Departments by Spend</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {departmentSpending.slice(0, 3).map((dept, index) => (
                <li key={index} className="flex justify-between">
                  <span>{dept.department}</span>
                  <span className="font-semibold">
                    ₱ {(dept.spending / 1000000).toFixed(1)}M
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border bg-white p-4">
            <h3 className="font-semibold">Upcoming Deadlines</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span>Dept submissions – Q4</span>
                <span className="rounded-lg bg-[var(--brand-gold)]/20 px-2 py-1 text-[var(--brand-ink)]">
                  Sep 30
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Consolidated review</span>
                <span className="rounded-lg bg-gray-100 px-2 py-1">Oct 05</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
