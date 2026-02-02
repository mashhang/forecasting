"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useForecast } from "@/app/context/ForecastContext";
import getApiUrl from "@/lib/getApiUrl";
import { useRouter } from "next/navigation";
import { type ForecastRow } from "@/lib/mockData";
import ForecastChart from "@/app/components/ForecastChart";

export default function Forecasting() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { addOrUpdateForecast, clearAllForecasts, setSelectedDepartment: setContextSelectedDepartment } = useForecast();

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
  const [predictionInterval, setPredictionInterval] = useState<{
    lower: number;
    upper: number;
  } | null>(null);

  useEffect(() => {
    if (!user || authLoading) {
      router.push("/login");
      return;
    }

    const fetchDepartments = async () => {
      try {
        const response = await fetch(
          `${getApiUrl()}/api/forecast/departments/${user.id}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch departments");
        }
        const result = await response.json();
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

      const response = await fetch(
        `${getApiUrl()}/api/forecast/generate/${user.id}?${params.toString()}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate forecast");
      }

      const result = await response.json();
      console.log("Forecast API Response:", result);
      console.log("Forecasts array:", result.forecasts);

      if (!result.forecasts || result.forecasts.length === 0) {
        throw new Error(
          "No forecast data returned. Please ensure you have uploaded budget data with at least 2 years of historical data."
        );
      }

      // Check if forecasts have valid values
      const hasValidForecasts = result.forecasts.some(
        (f: ForecastRow) =>
          f.forecastedQ1 > 0 ||
          f.forecastedQ2 > 0 ||
          f.forecastedQ3 > 0 ||
          f.forecastedQ4 > 0
      );

      if (!hasValidForecasts) {
        console.warn(
          "All forecast values are 0. This may indicate insufficient historical data."
        );
        setError(
          "Forecast generated but all values are 0. This usually means there isn't enough historical data (need at least 2 years/8 quarters of data for seasonality period of 4)."
        );
      }

      setForecasts(result.forecasts);
      addOrUpdateForecast(result.forecasts, selectedDepartment);
      setContextSelectedDepartment(selectedDepartment);

      // Calculate seasonal effect and prediction interval from forecasts if available
      if (result.forecasts && result.forecasts.length > 0) {
        const firstForecast = result.forecasts[0];
        const seasonalEffectValue =
          firstForecast.forecastedQ1 - (firstForecast.q1 || 0);
        setSeasonalEffect(seasonalEffectValue);

        // Calculate prediction interval for Q1 forecast
        // Collect all historical quarterly values to calculate standard deviation
        const historicalValues: number[] = [];
        result.forecasts.forEach((f: ForecastRow) => {
          if (f.q1 > 0) historicalValues.push(f.q1);
          if (f.q2 > 0) historicalValues.push(f.q2);
          if (f.q3 > 0) historicalValues.push(f.q3);
          if (f.q4 > 0) historicalValues.push(f.q4);
        });

        if (historicalValues.length > 0) {
          // Calculate mean and standard deviation
          const mean =
            historicalValues.reduce((sum, val) => sum + val, 0) /
            historicalValues.length;
          const variance =
            historicalValues.reduce(
              (sum, val) => sum + Math.pow(val - mean, 2),
              0
            ) / historicalValues.length;
          const stdDev = Math.sqrt(variance);

          // For 80% prediction interval, z-score is approximately 1.28
          // Use coefficient of variation approach: margin = forecast * (stdDev/mean) * z-score
          const forecastedQ1 = firstForecast.forecastedQ1;
          const coefficientOfVariation = mean > 0 ? stdDev / mean : 0.1; // Default to 10% if mean is 0
          const margin = forecastedQ1 * coefficientOfVariation * 1.28;

          const lower = Math.max(0, forecastedQ1 - margin);
          const upper = forecastedQ1 + margin;

          setPredictionInterval({ lower, upper });
        } else {
          // Fallback: use 10% of forecast value as margin
          const forecastedQ1 = firstForecast.forecastedQ1;
          const margin = forecastedQ1 * 0.1 * 1.28;
          setPredictionInterval({
            lower: Math.max(0, forecastedQ1 - margin),
            upper: forecastedQ1 + margin,
          });
        }

        // Generate chart data from forecasts
        const chartDataValue = {
          labels: result.forecasts.map((f: ForecastRow) => f.description),
          datasets: [
            {
              label: "Historical",
              data: result.forecasts.map((f: ForecastRow) => f.total),
            },
            {
              label: "Forecasted",
              data: result.forecasts.map((f: ForecastRow) => f.forecastedTotal),
            },
          ],
        };
        setChartData(chartDataValue);
      } else {
        setSeasonalEffect(0);
        setChartData(null);
        setPredictionInterval(null);
      }

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
                <button
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white py-2 text-gray-700 hover:bg-gray-50"
                  onClick={clearAllForecasts}
                >
                  Clear All Forecasts
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
                    {predictionInterval
                      ? `80% PI: ₱${(
                          predictionInterval.lower / 1000000
                        ).toFixed(2)}M – ₱${(
                          predictionInterval.upper / 1000000
                        ).toFixed(2)}M`
                      : "80% PI: Calculating..."}
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
