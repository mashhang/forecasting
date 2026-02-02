'use client';

import { ReportType, REPORT_CONFIGS } from '@/lib/reports/reportGenerators';

interface ReportSelectorProps {
  selectedType: ReportType;
  onTypeChange: (type: ReportType) => void;
}

export default function ReportSelector({
  selectedType,
  onTypeChange,
}: ReportSelectorProps) {
  const config = REPORT_CONFIGS[selectedType];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-[var(--brand-ink)] mb-2">
          Report Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value as ReportType)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[var(--brand-ink)] transition-all duration-300 focus:border-[var(--brand-green)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20"
        >
          {Object.entries(REPORT_CONFIGS).map(([type, reportConfig]) => (
            <option key={type} value={type}>
              {reportConfig.label}
            </option>
          ))}
        </select>
      </div>

      {config && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-900">{config.description}</p>
        </div>
      )}
    </div>
  );
}
