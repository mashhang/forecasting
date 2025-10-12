"use client";

import { useSidebar } from "@/app/context/SidebarContext";

export default function NotificationsPage() {
  const { isSidebarOpen } = useSidebar();

  return (
    <div
      className={`transition-all duration-300 ease-in-out h-screen md:ml-64 md:w-[calc(100%-16rem)] px-20
       
      `}
      /*  ${
          isSidebarOpen
            ? "md:ml-64 md:w-[calc(100%-16rem)] px-20"
            : "md:ml-0 w-full"
        } */
    >
      <div className="mx-auto max-w-[1600px] mt-4">
        <div className="rounded-2xl border bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <button className="rounded-xl border px-3 py-2">
              Mark all as read
            </button>
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="rounded-xl border bg-[var(--brand-green)]/5 p-3">
              <div className="font-semibold">Variance Alert</div>
              <div className="text-gray-600">
                Engineering proposal is 21.6% above forecast for Q4.
              </div>
              <div className="mt-1 text-xs text-gray-500">2h ago</div>
            </li>
            <li className="rounded-xl border p-3">
              <div className="font-semibold">Submission Reminder</div>
              <div className="text-gray-600">
                IT Department has not submitted Q4 proposal.
              </div>
              <div className="mt-1 text-xs text-gray-500">Yesterday</div>
            </li>
            <li className="rounded-xl border p-3">
              <div className="font-semibold">Data Upload</div>
              <div className="text-gray-600">
                SHS uploaded historical expenditures (2022–2024).
              </div>
              <div className="mt-1 text-xs text-gray-500">2 days ago</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
