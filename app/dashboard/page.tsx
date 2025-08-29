export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl">
      <section id="dashboard" className="module">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-4">
            <div className="text-sm text-gray-500">Total Forecast (Next Q)</div>
            <div className="mt-2 text-2xl font-bold">₱ 18.6M</div>
            <div className="mt-3 h-2 rounded-full bg-gray-100">
              <div className="h-2 w-3/5 rounded-full bg-[var(--brand-gold)]"></div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              ↑ 5.2% vs last quarter
            </div>
          </div>
          <div className="rounded-2xl border bg-white p-4">
            <div className="text-sm text-gray-500">Departments Submitted</div>
            <div className="mt-2 text-2xl font-bold">7 / 9</div>
            <div className="mt-3 flex gap-2">
              <span className="rounded-full bg-[var(--brand-green)]/10 px-2 py-1 text-xs text-[var(--brand-green)]">
                On time
              </span>
              <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
                Pending
              </span>
            </div>
          </div>
          <div className="rounded-2xl border bg-white p-4">
            <div className="text-sm text-gray-500">Variance Watchlist</div>
            <div className="mt-2 text-2xl font-bold">3</div>
            <p className="text-xs text-gray-500">
              Proposals deviating ≥ 15% from forecast
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Quarterly Trend (Mock Chart)
            </h2>
            <div className="flex gap-2">
              <button className="rounded-xl border px-3 py-1.5 text-sm">
                QTD
              </button>
              <button className="rounded-xl border bg-[var(--brand-green)] px-3 py-1.5 text-sm text-white">
                1Y
              </button>
              <button className="rounded-xl border px-3 py-1.5 text-sm">
                3Y
              </button>
            </div>
          </div>

          {/*  Chart placeholder  */}
          <div className="mt-4 grid h-48 place-items-center rounded-xl bg-gradient-to-b from-gray-50 to-gray-100 text-gray-400">
            Line/Bar Chart Placeholder
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-4">
            <h3 className="font-semibold">Top Departments by Spend</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Engineering</span>{" "}
                <span className="font-semibold">₱ 4.2M</span>
              </li>
              <li className="flex justify-between">
                <span>IT</span> <span className="font-semibold">₱ 3.7M</span>
              </li>
              <li className="flex justify-between">
                <span>SHS</span> <span className="font-semibold">₱ 2.9M</span>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border bg-white p-4">
            <h3 className="font-semibold">Upcoming Deadlines</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span>Dept submissions – Q4</span>
                <span className="rounded-lg bg-[var(--brand-gold)]/20 px-2 py-1 text-[var(--brand-ink)]">
                  Sep 30
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Consolidated review</span>
                <span className="rounded-lg bg-gray-100 px-2 py-1">Oct 05</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
