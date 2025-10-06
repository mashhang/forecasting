"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import getApiUrl from "@/lib/getApiUrl";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/app/context/SidebarContext";

type NormalizedRow = {
  description: string;
  justification: string | null;
  category: string;
  department: string;
  year: number;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  total: number;
};

type ForecastRow = NormalizedRow & {
  forecastedQ1: number;
  forecastedQ2: number;
  forecastedQ3: number;
  forecastedQ4: number;
  forecastedTotal: number;
};

type VarianceRow = ForecastRow & {
  varianceQ1: number | string;
  varianceQ2: number | string;
  varianceQ3: number | string;
  varianceQ4: number | string;
  varianceTotal: number | string;
};

export default function Forecasting() {
  const { isSidebarOpen } = useSidebar();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [seasonalityPeriod, setSeasonalityPeriod] = useState<number>(4);
  const [alpha, setAlpha] = useState<number>(0.5);
  const [beta, setBeta] = useState<number>(0.3);
  const [gamma, setGamma] = useState<number>(0.2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [forecasts, setForecasts] = useState<ForecastRow[]>([]);
  const [varianceAnalysis, setVarianceAnalysis] = useState<VarianceRow[]>([]);

  useEffect(() => {
    if (!user || authLoading) {
      router.push("/login");
      return;
    }

    const fetchDepartments = async () => {
      console.log("Base API URL:", getApiUrl()); // Add this line
          console.log("Fetching departments...");
      try {
        const response = await fetch(`${getApiUrl()}/api/forecast/departments/${user.id}`);
        console.log("Department API Response:", response);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch departments");
        }
        const result = await response.json();
        console.log("Fetched departments:", result.departments);
        setDepartments(result.departments);
        if (result.departments.length > 0) {
          setSelectedDepartment(result.departments[0]);
        }
      } catch (err: any) {
        console.error("Error in fetchDepartments:", err);
        setError(err.message || "An error occurred while fetching departments");
      }
    };

    fetchDepartments();
  }, [user, router, authLoading]);

  const handleGenerateForecast = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const params = new URLSearchParams({
        department: selectedDepartment,
        seasonalityPeriod: seasonalityPeriod.toString(),
        alpha: alpha.toString(),
        beta: beta.toString(),
        gamma: gamma.toString(),
      });

      const response = await fetch(`${getApiUrl()}/api/forecast/generate/${user.id}?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate forecast");
      }

      const result = await response.json();
      setForecasts(result.forecasts);
      setVarianceAnalysis(result.varianceAnalysis);
      setMessage("Forecast generated successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unknown error occurred during forecasting");
    } finally {
      setLoading(false);
    }
  };

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
      {authLoading ? (
        <div className="flex items-center justify-center h-full text-gray-500">Loading user data...</div>
      ) : (
        <div className="mx-auto max-w-[1600px] mt-4">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border bg-white p-6 lg:col-span-1">
              <h2 className="text-lg font-semibold">Model Settings</h2>
              <div className="mt-3 space-y-3 text-sm">
                <div>
                  <label className="block">Department</label>
                  <select
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block">Seasonality (m)</label>
                  <input
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    value={seasonalityPeriod}
                    onChange={(e) => setSeasonalityPeriod(Number(e.target.value))}
                    type="number"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block">Error / Trend / Seasonality</label>
                  <select className="mt-1 w-full rounded-xl border px-3 py-2">
                    <option>
                      ETS(A,Ad,A) – Additive, Damped Trend, Additive Seasonality
                    </option>
                    <option>
                      ETS(A,N,A) – Additive, No Trend, Additive Seasonality
                    </option>
                    <option>
                      ETS(M,N,M) – Multiplicative Level & Seasonality
                    </option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input id="boxcox" type="checkbox" className="rounded" />
                  <label htmlFor="boxcox">Use Box–Cox (stabilize variance)</label>
                </div>
                <button
                  className="mt-2 w-full rounded-xl bg-[var(--brand-green)] py-2 text-white"
                  onClick={handleGenerateForecast}
                  disabled={loading || !user || departments.length === 0}
                >
                  {loading ? "Running Forecast..." : "Run Forecast"}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Forecast Output</h2>
                <div className="flex gap-2">
                  <button className="rounded-xl border px-3 py-2">Save</button>
                  <button className="rounded-xl border px-3 py-2">Export CSV</button>
                </div>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="text-sm text-gray-500">Next Quarter Forecast</div>
                  <div className="mt-1 text-2xl font-bold">₱ {forecasts.length > 0 ? forecasts[0].forecastedQ1.toLocaleString() : "N/A"}</div>
                  <div className="text-xs text-gray-500">80% PI: ₱ 1.15M – ₱ 1.36M</div>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="text-sm text-gray-500">YoY Seasonal Effect</div>
                  <div className="mt-1 text-2xl font-bold">+₱ 120k</div>
                  <div className="text-xs text-gray-500">vs same quarter last year</div>
                </div>
              </div>
              <div className="mt-4 grid h-56 place-items-center rounded-xl bg-gradient-to-b from-gray-50 to-gray-100 text-gray-400">
                Forecast Plot Placeholder
              </div>
              <div className="mt-4 overflow-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-3 py-2">Description</th>
                      <th className="px-3 py-2">Department</th>
                      <th className="px-3 py-2">Year</th>
                      <th className="px-3 py-2">Q1</th>
                      <th className="px-3 py-2">Q2</th>
                      <th className="px-3 py-2">Q3</th>
                      <th className="px-3 py-2">Q4</th>
                      <th className="px-3 py-2">Total</th>
                      <th className="px-3 py-2">Forecasted Q1</th>
                      <th className="px-3 py-2">Forecasted Q2</th>
                      <th className="px-3 py-2">Forecasted Q3</th>
                      <th className="px-3 py-2">Forecasted Q4</th>
                      <th className="px-3 py-2">Forecasted Total</th>
                      <th className="px-3 py-2">Variance Q1</th>
                      <th className="px-3 py-2">Variance Q2</th>
                      <th className="px-3 py-2">Variance Q3</th>
                      <th className="px-3 py-2">Variance Q4</th>
                      <th className="px-3 py-2">Variance Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {forecasts.length === 0 ? (
                      <tr>
                        <td colSpan={18} className="px-3 py-6 text-center text-gray-500">
                          No forecast data available. Please select a department and run the forecast.
                        </td>
                      </tr>
                    ) : (
                      forecasts.map((forecastItem, idx) => (
                        <tr key={idx} className="hover:bg-gray-100">
                          <td className="px-3 py-2">{forecastItem.description}</td>
                          <td className="px-3 py-2">{forecastItem.department || "N/A"}</td>
                          <td className="px-3 py-2">{forecastItem.year}</td>
                          <td className="px-3 py-2">₱{forecastItem.q1.toLocaleString()}</td>
                          <td className="px-3 py-2">₱{forecastItem.q2.toLocaleString()}</td>
                          <td className="px-3 py-2">₱{forecastItem.q3.toLocaleString()}</td>
                          <td className="px-3 py-2">₱{forecastItem.q4.toLocaleString()}</td>
                          <td className="px-3 py-2">₱{forecastItem.total.toLocaleString()}</td>
                          <td className="px-3 py-2">₱{forecastItem.forecastedQ1.toLocaleString()}</td>
                          <td className="px-3 py-2">₱{forecastItem.forecastedQ2.toLocaleString()}</td>
                          <td className="px-3 py-2">₱{forecastItem.forecastedQ3.toLocaleString()}</td>
                          <td className="px-3 py-2">₱{forecastItem.forecastedQ4.toLocaleString()}</td>
                          <td className="px-3 py-2">₱{forecastItem.forecastedTotal.toLocaleString()}</td>
                          <td className="px-3 py-2">{typeof varianceAnalysis[idx]?.varianceQ1 === 'number' ? `₱${varianceAnalysis[idx]?.varianceQ1.toLocaleString()}` : varianceAnalysis[idx]?.varianceQ1}</td>
                          <td className="px-3 py-2">{typeof varianceAnalysis[idx]?.varianceQ2 === 'number' ? `₱${varianceAnalysis[idx]?.varianceQ2.toLocaleString()}` : varianceAnalysis[idx]?.varianceQ2}</td>
                          <td className="px-3 py-2">{typeof varianceAnalysis[idx]?.varianceQ3 === 'number' ? `₱${varianceAnalysis[idx]?.varianceQ3.toLocaleString()}` : varianceAnalysis[idx]?.varianceQ3}</td>
                          <td className="px-3 py-2">{typeof varianceAnalysis[idx]?.varianceQ4 === 'number' ? `₱${varianceAnalysis[idx]?.varianceQ4.toLocaleString()}` : varianceAnalysis[idx]?.varianceQ4}</td>
                          <td className="px-3 py-2">{typeof varianceAnalysis[idx]?.varianceTotal === 'number' ? `₱${varianceAnalysis[idx]?.varianceTotal.toLocaleString()}` : varianceAnalysis[idx]?.varianceTotal}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
