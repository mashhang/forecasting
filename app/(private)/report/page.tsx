"use client";

import { useSidebar } from "@/app/context/SidebarContext";

export default function ReportGenerationPage() {
  const { isSidebarOpen } = useSidebar();

  return (
    <div
      className={`transition-all duration-300 ease-in-out h-screen
        ${
          isSidebarOpen
            ? "md:ml-64 md:w-[calc(100%-16rem)] px-20"
            : "md:ml-0 w-full"
        }
      `}
    >
      <div className="mx-auto max-w-[1600px] mt-4">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-6">
            <h2 className="text-lg font-semibold">Generate Reports</h2>
            <div className="mt-3 space-y-3 text-sm">
              <div>
                <label className="block">Report Type</label>
                <select className="mt-1 w-full rounded-xl border px-3 py-2">
                  <option>Quarterly Forecast Summary</option>
                  <option>Variance by Department</option>
                  <option>Annual Consolidated Budget</option>
                </select>
              </div>
              <div>
                <label className="block">Quarter / Year</label>
                <div className="grid grid-cols-2 gap-3">
                  <select className="rounded-xl border px-3 py-2">
                    <option>Q1</option>
                    <option>Q2</option>
                    <option>Q3</option>
                    <option>Q4</option>
                  </select>
                  <select className="rounded-xl border px-3 py-2">
                    <option>2025</option>
                    <option>2024</option>
                    <option>2023</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="rounded-xl bg-[var(--brand-green)] px-3 py-2 text-white">
                  Preview
                </button>
                <button className="rounded-xl border px-3 py-2">
                  Export PDF
                </button>
                <button className="rounded-xl border px-3 py-2">
                  Export Excel
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <h2 className="text-lg font-semibold">Preview (Mock)</h2>
            <div className="mt-4 grid h-64 place-items-center rounded-xl bg-gradient-to-b from-gray-50 to-gray-100 text-gray-400">
              Report Preview Placeholder
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
