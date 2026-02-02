'use client';

import { ReportFilters, ReportConfig } from '@/lib/reports/types';
import { getAvailableQuarters, getAvailableStatuses } from '@/lib/reports/reportGenerators';

interface ReportFiltersProps {
  config: ReportConfig;
  filters: ReportFilters;
  onFiltersChange: (filters: ReportFilters) => void;
  availableDepartments: string[];
  availableYears: number[];
}

export default function ReportFiltersComponent({
  config,
  filters,
  onFiltersChange,
  availableDepartments,
  availableYears,
}: ReportFiltersProps) {
  const quarters = getAvailableQuarters();
  const statuses = getAvailableStatuses();

  const handleFilterChange = (key: keyof ReportFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined, // Remove filter if empty
    });
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {/* Department Filter */}
      <div>
        <label className="block text-sm font-semibold text-[var(--brand-ink)] mb-2">
          Department
        </label>
        <select
          value={filters.department || ''}
          onChange={(e) => handleFilterChange('department', e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[var(--brand-ink)] transition-all duration-300 focus:border-[var(--brand-green)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20"
        >
          <option value="">All Departments</option>
          {availableDepartments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Quarter Filter */}
      <div>
        <label className="block text-sm font-semibold text-[var(--brand-ink)] mb-2">
          Quarter
        </label>
        <select
          value={filters.quarter || ''}
          onChange={(e) => handleFilterChange('quarter', e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[var(--brand-ink)] transition-all duration-300 focus:border-[var(--brand-green)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20"
        >
          <option value="">All Quarters</option>
          {quarters.map((quarter) => (
            <option key={quarter} value={quarter}>
              {quarter}
            </option>
          ))}
        </select>
      </div>

      {/* Year Filter */}
      <div>
        <label className="block text-sm font-semibold text-[var(--brand-ink)] mb-2">
          Year
        </label>
        <select
          value={filters.year || ''}
          onChange={(e) => handleFilterChange('year', e.target.value ? parseInt(e.target.value) : undefined)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[var(--brand-ink)] transition-all duration-300 focus:border-[var(--brand-green)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20"
        >
          <option value="">All Years</option>
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div>
        <label className="block text-sm font-semibold text-[var(--brand-ink)] mb-2">
          Status
        </label>
        <select
          value={filters.status || ''}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[var(--brand-ink)] transition-all duration-300 focus:border-[var(--brand-green)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20"
        >
          <option value="">All Statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
