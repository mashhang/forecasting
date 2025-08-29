"use client";

import { useSidebar } from "@/app/context/SidebarContext";

export default function VarianceAnalysisPage() {
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
        <div className="rounded-2xl border bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Variance Analysis</h2>
            <div className="flex gap-2">
              <button className="rounded-xl border px-3 py-2">Export</button>
              <button className="rounded-xl bg-[var(--brand-gold)] px-3 py-2">
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
                <tr>
                  <td className="px-3 py-2">Engineering</td>
                  <td className="px-3 py-2">₱ 1.25M</td>
                  <td className="px-3 py-2">₱ 1.52M</td>
                  <td className="px-3 py-2">₱ 0.27M</td>
                  <td className="px-3 py-2 font-semibold text-red-600">
                    +21.6%
                  </td>
                  <td className="px-3 py-2">
                    <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-700">
                      Review
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2">IT</td>
                  <td className="px-3 py-2">₱ 0.98M</td>
                  <td className="px-3 py-2">₱ 0.96M</td>
                  <td className="px-3 py-2">-₱ 0.02M</td>
                  <td className="px-3 py-2 font-semibold text-green-700">
                    -2.0%
                  </td>
                  <td className="px-3 py-2">
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                      OK
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2">SHS</td>
                  <td className="px-3 py-2">₱ 0.75M</td>
                  <td className="px-3 py-2">₱ 0.89M</td>
                  <td className="px-3 py-2">₱ 0.14M</td>
                  <td className="px-3 py-2 font-semibold text-yellow-700">
                    +18.7%
                  </td>
                  <td className="px-3 py-2">
                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
                      Check
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
