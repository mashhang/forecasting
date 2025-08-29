"use client";

import { useSidebar } from "@/app/context/SidebarContext";

export default function DataManagementPage() {
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
            <h2 className="text-lg font-semibold">Data Management</h2>
            <button className="rounded-xl bg-[var(--brand-gold)] px-3 py-2 text-[var(--brand-ink)]">
              Upload CSV/Excel
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Historical quarterly budget & expenditure (last 3 years).
          </p>
          <div className="mt-4 overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-3 py-2">Department</th>
                  <th className="px-3 py-2">Year</th>
                  <th className="px-3 py-2">Q1</th>
                  <th className="px-3 py-2">Q2</th>
                  <th className="px-3 py-2">Q3</th>
                  <th className="px-3 py-2">Q4</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-3 py-2">Engineering</td>
                  <td className="px-3 py-2">2023</td>
                  <td className="px-3 py-2">₱1.0M</td>
                  <td className="px-3 py-2">₱1.1M</td>
                  <td className="px-3 py-2">₱1.2M</td>
                  <td className="px-3 py-2">₱1.0M</td>
                  <td className="space-x-2 px-3 py-2">
                    <button className="rounded-lg border px-2 py-1 text-xs">
                      Edit
                    </button>
                    <button className="rounded-lg border px-2 py-1 text-xs">
                      Delete
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2">IT</td>
                  <td className="px-3 py-2">2023</td>
                  <td className="px-3 py-2">₱0.8M</td>
                  <td className="px-3 py-2">₱0.9M</td>
                  <td className="px-3 py-2">₱1.0M</td>
                  <td className="px-3 py-2">₱0.95M</td>
                  <td className="space-x-2 px-3 py-2">
                    <button className="rounded-lg border px-2 py-1 text-xs">
                      Edit
                    </button>
                    <button className="rounded-lg border px-2 py-1 text-xs">
                      Delete
                    </button>
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
