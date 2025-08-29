import Image from "next/image";
import logo from "../../public/logo.png";

export default function TopNav() {
  return (
    <div className="sticky top-0 z-40 border-b border-gray-200 bg-[var(--brand-white)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 rounded-full">
            <Image src={logo} alt="Logo" width={40} height={40} />
          </div>
          <div>
            <h1 className="text-lg font-semibold sm:text-xl">
              Lyceum of Alabang
            </h1>
            <p className="text-xs text-gray-500">
              Departmental Quarterly Budget Forecasting
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="hidden rounded-xl bg-[var(--brand-green)] px-3 py-2 text-sm text-white hover:opacity-90 sm:inline-flex">
            New Quarter
          </button>
          <button className="rounded-xl border px-3 py-2 text-sm">Help</button>
          <div className="ml-2 grid h-9 w-9 place-items-center rounded-full bg-gray-200 text-sm font-semibold">
            FM
          </div>
        </div>
      </div>
    </div>
  );
}
