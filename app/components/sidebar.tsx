export default function Sidebar() {
  return (
    <>
      <nav className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r border-gray-200 bg-[var(--brand-white)] p-4">
        <div className="px-3 py-2 text-xs font-semibold text-gray-1000">
          Sidebar
        </div>
        <ul id="nav" className="space-y-1">
          <li>
            <button
              data-target="dashboard"
              className="navbtn flex w-full items-center gap-2 rounded-xl bg-[var(--brand-green)] px-3 py-2 text-left text-white hover:bg-gray-100 hover:text-black"
            >
              🏠 <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button
              data-target="data"
              className="navbtn flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-gray-100 hover:text-black"
            >
              🗂️ <span>Data Management</span>
            </button>
          </li>
          <li>
            <button
              data-target="forecast"
              className="navbtn flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-gray-100 hover:text-black"
            >
              📈 <span>Forecasting (Holt–Winters)</span>
            </button>
          </li>
          <li>
            <button
              data-target="variance"
              className="navbtn flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-gray-100 hover:text-black"
            >
              📊 <span>Variance Analysis</span>
            </button>
          </li>
          <li>
            <button
              data-target="reports"
              className="navbtn flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-gray-100 hover:text-black"
            >
              📝 <span>Report Generation</span>
            </button>
          </li>
          <li>
            <button
              data-target="admin"
              className="navbtn flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-gray-100 hover:text-black"
            >
              ⚙️ <span>Administration</span>
            </button>
          </li>
          <li>
            <button
              data-target="notify"
              className="navbtn flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-gray-100 hover:text-black"
            >
              🔔 <span>Notifications</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
