"use client";

import { useSidebar } from "@/app/context/SidebarContext";

export default function DataManagementPage() {
  const { isSidebarOpen } = useSidebar();
<<<<<<< Updated upstream
=======
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [rows, setRows] = useState<NormalizedRow[]>([]);

  const { user } = useAuth();

  // inside DataManagementPage
  useEffect(() => {
    if (!user?.id) return;

    const fetchRows = async () => {
      try {
        const res = await fetch(
          `http://localhost:5001/api/file/rows/${user.id}`
        );
        const data = await res.json();
        setRows(data.rows || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRows();
  }, [user?.id]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !user.id) {
      setMessage("❌ User info not ready. Please wait a moment and try again.");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user.id); // now guaranteed to exist

    try {
      setUploading(true);
      setMessage("");

      const res = await fetch("http://localhost:5001/api/file/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.details) {
          throw new Error(`${data.error}: ${data.details.join(', ')}`);
        }
        throw new Error(data.error || "Upload failed");
      }

      // Set rows for display
      setRows(data.rows); // data.rows comes from your backend

      // Enhanced success message with summary
      const summary = data.summary;
      setMessage(
        `✅ Uploaded successfully: ${data.count} rows\n` +
        `📊 Total Budget: ₱${summary.totalBudget.toLocaleString()}\n` +
        `🏢 Departments: ${summary.departmentCount} | 📁 Categories: ${summary.categoryCount}\n` +
        `📋 Proposal: ${data.proposalTitle}`
      );
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
=======
                  <th className="px-3 py-2">Description</th>
                  <th className="px-3 py-2">Justification</th>
                  <th className="px-3 py-2">Category</th>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
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
                      <td className="px-3 py-2 max-w-xs truncate" title={row.justification || ""}>
                        {row.justification || "N/A"}
                      </td>
                      <td className="px-3 py-2">{row.category}</td>
                      <td className="px-3 py-2">{row.department}</td>
                      <td className="px-3 py-2">{row.year}</td>
                      <td className="px-3 py-2">₱{row.q1.toLocaleString()}</td>
                      <td className="px-3 py-2">₱{row.q2.toLocaleString()}</td>
                      <td className="px-3 py-2">₱{row.q3.toLocaleString()}</td>
                      <td className="px-3 py-2">₱{row.q4.toLocaleString()}</td>
                      <td className="px-3 py-2 font-medium">₱{row.total.toLocaleString()}</td>
                    </tr>
                  ))
                )}
>>>>>>> Stashed changes
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
