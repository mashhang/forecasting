export default function Forecasting() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold">Model Settings</h2>
          <div className="mt-3 space-y-3 text-sm">
            <div>
              <label className="block">Department</label>
              <select className="mt-1 w-full rounded-xl border px-3 py-2">
                <option>Engineering</option>
                <option>IT</option>
                <option>SHS</option>
                <option>Research</option>
              </select>
            </div>
            <div>
              <label className="block">Seasonality (m)</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2"
                value="4"
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
                <option>ETS(M,N,M) – Multiplicative Level & Seasonality</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input id="boxcox" type="checkbox" className="rounded" />
              <label htmlFor="boxcox">Use Box–Cox (stabilize variance)</label>
            </div>
            <button className="mt-2 w-full rounded-xl bg-[var(--brand-green)] py-2 text-white">
              Run Forecast
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
              <div className="text-sm text-gray-500">Next Quarter Forecast</div>
              <div className="mt-1 text-2xl font-bold">₱ 1.25M</div>
              <div className="text-xs text-gray-500">
                80% PI: ₱ 1.15M – ₱ 1.36M
              </div>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="text-sm text-gray-500">YoY Seasonal Effect</div>
              <div className="mt-1 text-2xl font-bold">+₱ 120k</div>
              <div className="text-xs text-gray-500">
                vs same quarter last year
              </div>
            </div>
          </div>
          <div className="mt-4 grid h-56 place-items-center rounded-xl bg-gradient-to-b from-gray-50 to-gray-100 text-gray-400">
            Forecast Plot Placeholder
          </div>
          <div className="mt-4 overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-3 py-2">Quarter</th>
                  <th className="px-3 py-2">Forecast</th>
                  <th className="px-3 py-2">PI Low</th>
                  <th className="px-3 py-2">PI High</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-3 py-2">2025 Q1</td>
                  <td className="px-3 py-2">₱ 1.25M</td>
                  <td className="px-3 py-2">₱ 1.15M</td>
                  <td className="px-3 py-2">₱ 1.36M</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">2025 Q2</td>
                  <td className="px-3 py-2">₱ 1.28M</td>
                  <td className="px-3 py-2">₱ 1.18M</td>
                  <td className="px-3 py-2">₱ 1.40M</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">2025 Q3</td>
                  <td className="px-3 py-2">₱ 1.22M</td>
                  <td className="px-3 py-2">₱ 1.10M</td>
                  <td className="px-3 py-2">₱ 1.36M</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">2025 Q4</td>
                  <td className="px-3 py-2">₱ 1.31M</td>
                  <td className="px-3 py-2">₱ 1.20M</td>
                  <td className="px-3 py-2">₱ 1.45M</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
