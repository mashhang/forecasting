"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
// import getApiUrl from "@/lib/getApiUrl"; // COMMENTED OUT - Using mock data instead
import { useRouter } from "next/navigation";
import { useSidebar } from "@/app/context/SidebarContext";
import {
  mockDepartments,
  generateMockForecast,
  type ForecastRow,
} from "@/lib/mockData";
import ForecastChart from "@/app/components/ForecastChart";

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
  const [seasonalEffect, setSeasonalEffect] = useState<number>(0);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (!user || authLoading) {
      router.push("/login");
      return;
    }

    // COMMENTED OUT - Using mock data instead of API calls
    // const fetchDepartments = async () => {
    //   console.log("Base API URL:", getApiUrl()); // Add this line
    //       console.log("Fetching departments...");
    //   try {
    //     const response = await fetch(`${getApiUrl()}/api/forecast/departments/${user.id}`);
    //     console.log("Department API Response:", response);
    //     if (!response.ok) {
    //       const errorData = await response.json();
    //       throw new Error(errorData.error || "Failed to fetch departments");
    //     }
    //     const result = await response.json();
    //     console.log("Fetched departments:", result.departments);
    //     setDepartments(result.departments);
    //     if (result.departments.length > 0) {
    //       setSelectedDepartment(result.departments[0]);
    //     }
    //   } catch (err: any) {
    //     console.error("Error in fetchDepartments:", err);
    //     setError(err.message || "An error occurred while fetching departments");
    //   }
    // };

    // fetchDepartments();

    // Load mock departments
    setDepartments(mockDepartments);
    if (mockDepartments.length > 0) {
      setSelectedDepartment(mockDepartments[0]);
    }
  }, [user, router, authLoading]);

  const handleGenerateForecast = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    // setMessage(null);

    try {
      // COMMENTED OUT - Using mock data instead of API calls
      // const params = new URLSearchParams({
      //   department: selectedDepartment,
      //   seasonalityPeriod: seasonalityPeriod.toString(),
      //   alpha: alpha.toString(),
      //   beta: beta.toString(),
      //   gamma: gamma.toString(),
      // });

      // const response = await fetch(`${getApiUrl()}/api/forecast/generate/${user.id}?${params.toString()}`);

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.error || "Failed to generate forecast");
      // }

      // const result = await response.json();
      // setForecasts(result.forecasts);
      // setVarianceAnalysis(result.varianceAnalysis);
      // setMessage("Forecast generated successfully!");

      // MOCK FORECAST GENERATION
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const result = generateMockForecast(
        selectedDepartment,
        seasonalityPeriod,
        alpha,
        beta,
        gamma
      );

      setForecasts(result.forecasts);
      setSeasonalEffect(result.seasonalEffect);
      setChartData(result.chartData);
      // setMessage(
      //   `Mock forecast generated successfully for ${selectedDepartment}!`
      // );
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unknown error occurred during forecasting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`transition-all duration-300 ease-in-out h-screen md:ml-64 md:w-[calc(100%-16rem)] px-20
      `}
      /*${
          isSidebarOpen
            ? "md:ml-64 md:w-[calc(100%-16rem)] px-20"
            : "md:ml-0 w-full"
        }
             */
    >
      {authLoading ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          Loading user data...
        </div>
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
                    onChange={(e) =>
                      setSeasonalityPeriod(Number(e.target.value))
                    }
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
                  <label htmlFor="boxcox">
                    Use Box–Cox (stabilize variance)
                  </label>
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
                  <button className="rounded-xl border px-3 py-2">
                    Export CSV
                  </button>
                </div>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="text-sm text-gray-500">
                    Next Quarter Forecast
                  </div>
                  <div className="mt-1 text-2xl font-bold">
                    ₱{" "}
                    {forecasts.length > 0
                      ? forecasts[0].forecastedQ1.toLocaleString()
                      : "N/A"}
                  </div>
                  <div className="text-xs text-gray-500">
                    80% PI: ₱ 1.15M – ₱ 1.36M
                  </div>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="text-sm text-gray-500">
                    YoY Seasonal Effect
                  </div>
                  <div className="mt-1 text-2xl font-bold">
                    {seasonalEffect >= 0 ? "+" : ""}₱{" "}
                    {(Math.abs(seasonalEffect) / 1000).toFixed(0)}k
                  </div>
                  <div className="text-xs text-gray-500">
                    vs same quarter last year
                  </div>
                </div>
              </div>
              {message && (
                <div className="mt-4 rounded-xl bg-green-50 border border-green-200 p-4">
                  <p className="text-sm text-green-800">{message}</p>
                </div>
              )}
              {error && (
                <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
              <div className="mt-4 rounded-xl bg-white p-4 border">
                <ForecastChart
                  forecasts={forecasts}
                  department={selectedDepartment}
                  chartData={chartData}
                />
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
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {forecasts.length === 0 ? (
                      <tr>
                        <td
                          colSpan={13}
                          className="px-3 py-6 text-center text-gray-500"
                        >
                          No forecast data available. Please select a department
                          and run the forecast.
                        </td>
                      </tr>
                    ) : (
                      forecasts.map((forecastItem, idx) => (
                        <tr key={idx} className="hover:bg-gray-100">
                          <td className="px-3 py-2">
                            {forecastItem.description}
                          </td>
                          <td className="px-3 py-2">
                            {forecastItem.department || "N/A"}
                          </td>
                          <td className="px-3 py-2">{forecastItem.year}</td>
                          <td className="px-3 py-2">
                            ₱{forecastItem.q1.toLocaleString()}
                          </td>
                          <td className="px-3 py-2">
                            ₱{forecastItem.q2.toLocaleString()}
                          </td>
                          <td className="px-3 py-2">
                            ₱{forecastItem.q3.toLocaleString()}
                          </td>
                          <td className="px-3 py-2">
                            ₱{forecastItem.q4.toLocaleString()}
                          </td>
                          <td className="px-3 py-2">
                            ₱{forecastItem.total.toLocaleString()}
                          </td>
                          <td className="px-3 py-2">
                            ₱{forecastItem.forecastedQ1.toLocaleString()}
                          </td>
                          <td className="px-3 py-2">
                            ₱{forecastItem.forecastedQ2.toLocaleString()}
                          </td>
                          <td className="px-3 py-2">
                            ₱{forecastItem.forecastedQ3.toLocaleString()}
                          </td>
                          <td className="px-3 py-2">
                            ₱{forecastItem.forecastedQ4.toLocaleString()}
                          </td>
                          <td className="px-3 py-2">
                            ₱{forecastItem.forecastedTotal.toLocaleString()}
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
      )}
    </div>
  );
}
