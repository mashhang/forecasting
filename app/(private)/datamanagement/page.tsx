"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useSidebar } from "@/app/context/SidebarContext";
import { useRef, useState, useEffect } from "react";
// import getApiUrl from "@/lib/getApiUrl"; // COMMENTED OUT - Using mock data instead
import { mockData, getMockSummary, type NormalizedRow } from "@/lib/mockData";

export default function DataManagementPage() {
  const { isSidebarOpen } = useSidebar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [rows, setRows] = useState<NormalizedRow[]>([]);

  const { user } = useAuth();

  // COMMENTED OUT - Using mock data instead of API calls
  // useEffect(() => {
  //   if (!user?.id) return;

  //   const fetchRows = async () => {
  //     try {
  //       const res = await fetch(
  //         `${getApiUrl()}/api/file/rows/${user.id}`
  //       );
  //       const data = await res.json();
  //       setRows(data.rows || []);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   fetchRows();
  // }, [user?.id]);

  // Load mock data on component mount
  useEffect(() => {
    setRows(mockData);
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // COMMENTED OUT - Using mock data instead of actual file upload
    // if (!user || !user.id) {
    //   setMessage("❌ User info not ready. Please wait a moment and try again.");
    //   return;
    // }

    // const file = e.target.files?.[0];
    // if (!file) return;

    // const formData = new FormData();
    // formData.append("file", file);
    // formData.append("userId", user.id); // now guaranteed to exist

    // try {
    //   setUploading(true);
    //   setMessage("");

    //   const res = await fetch(`${getApiUrl()}/api/file/upload`, {
    //     method: "POST",
    //     body: formData,
    //   });

    //   const data = await res.json();
    //   if (!res.ok) {
    //     if (data.details) {
    //       throw new Error(`${data.error}: ${data.details.join(', ')}`);
    //     }
    //     throw new Error(data.error || "Upload failed");
    //   }

    //   // Set rows for display
    //   setRows(data.rows); // data.rows comes from your backend

    //   // Enhanced success message with summary
    //   const summary = data.summary;
    //   setMessage(
    //     `✅ Uploaded successfully: ${data.count} rows\n` +
    //     `📊 Total Budget: ₱${summary.totalBudget.toLocaleString()}\n` +
    //     `🏢 Departments: ${summary.departmentCount} | 📁 Categories: ${summary.categoryCount}\n` +
    //     `📋 Proposal: ${data.proposalTitle}`
    //   );
    // } catch (err: any) {
    //   setMessage(`❌ ${err.message}`);
    // } finally {
    //   setUploading(false);
    //   if (fileInputRef.current) fileInputRef.current.value = "";
    // }

    // MOCK FILE UPLOAD SIMULATION
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setMessage("");

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Use mock data as if it was uploaded
      const summary = getMockSummary(mockData);
      setRows(mockData);

      setMessage(
        `✅ Mock Upload Successful: ${mockData.length} rows loaded\n` +
          `📊 Total Budget: ₱${summary.totalBudget.toLocaleString()}\n` +
          `🏢 Departments: ${summary.departmentCount} | 📁 Categories: ${summary.categoryCount}\n` +
          `📋 Proposal: ${summary.proposalTitle}`
      );
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className={`transition-all duration-300 ease-in-out h-screen md:ml-64 md:w-[calc(100%-16rem)] px-20 `}
      /* ${
        isSidebarOpen
          ? "md:ml-64 md:w-[calc(100%-16rem)] px-20"
          : "md:ml-0 w-full"
      } */
    >
      <div className="mx-auto max-w-[1600px] mt-4">
        <div className="rounded-2xl border bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Data Management</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleUploadClick}
                disabled={uploading || !user?.id}
                className="rounded-xl bg-[var(--brand-gold)] px-3 py-2 text-[var(--brand-ink)]"
              >
                {uploading ? "Uploading..." : "Upload CSV/Excel"}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {message && (
            <p className="mt-2 text-sm font-medium text-blue-600">{message}</p>
          )}

          <div className="mt-4 overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-3 py-2">Description</th>
                  <th className="px-3 py-2">Justification</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">Department</th>
                  <th className="px-3 py-2">Year</th>
                  <th className="px-3 py-2">Q1</th>
                  <th className="px-3 py-2">Q2</th>
                  <th className="px-3 py-2">Q3</th>
                  <th className="px-3 py-2">Q4</th>
                  <th className="px-3 py-2">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-3 py-6 text-center text-gray-500"
                    >
                      No data uploaded yet
                    </td>
                  </tr>
                ) : (
                  rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-100">
                      <td className="px-3 py-2">{row.description}</td>
                      <td
                        className="px-3 py-2 max-w-xs truncate"
                        title={row.justification || ""}
                      >
                        {row.justification || "N/A"}
                      </td>
                      <td className="px-3 py-2">{row.category}</td>
                      <td className="px-3 py-2">{row.department}</td>
                      <td className="px-3 py-2">{row.year}</td>
                      <td className="px-3 py-2">₱{row.q1.toLocaleString()}</td>
                      <td className="px-3 py-2">₱{row.q2.toLocaleString()}</td>
                      <td className="px-3 py-2">₱{row.q3.toLocaleString()}</td>
                      <td className="px-3 py-2">₱{row.q4.toLocaleString()}</td>
                      <td className="px-3 py-2 font-medium">
                        ₱{row.total.toLocaleString()}
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
