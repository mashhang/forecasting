// Mock data service for testing without database integration
export type NormalizedRow = {
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

export type ForecastRow = NormalizedRow & {
  forecastedQ1: number;
  forecastedQ2: number;
  forecastedQ3: number;
  forecastedQ4: number;
  forecastedTotal: number;
};

export type VarianceRow = ForecastRow & {
  varianceQ1: number | string;
  varianceQ2: number | string;
  varianceQ3: number | string;
  varianceQ4: number | string;
  varianceTotal: number | string;
};

// Mock data for testing
export const mockData: NormalizedRow[] = [
  {
    description: "Office Supplies and Stationery",
    justification: "Essential supplies for daily operations",
    category: "Operating Expenses",
    department: "IT",
    year: 2024,
    q1: 15000,
    q2: 18000,
    q3: 12000,
    q4: 20000,
    total: 65000,
  },
  {
    description: "Software Licenses",
    justification: "Annual subscriptions for productivity tools",
    category: "Technology",
    department: "IT",
    year: 2024,
    q1: 25000,
    q2: 0,
    q3: 0,
    q4: 0,
    total: 25000,
  },
  {
    description: "Hardware Maintenance",
    justification: "Regular maintenance and repairs",
    category: "Technology",
    department: "IT",
    year: 2024,
    q1: 8000,
    q2: 12000,
    q3: 15000,
    q4: 10000,
    total: 45000,
  },
  {
    description: "Employee Training Programs",
    justification: "Professional development initiatives",
    category: "Human Resources",
    department: "Engineering",
    year: 2024,
    q1: 30000,
    q2: 25000,
    q3: 35000,
    q4: 20000,
    total: 110000,
  },
  {
    description: "Research and Development",
    justification: "Innovation and product development",
    category: "R&D",
    department: "Engineering",
    year: 2024,
    q1: 50000,
    q2: 60000,
    q3: 55000,
    q4: 65000,
    total: 230000,
  },
  {
    description: "Marketing Campaigns",
    justification: "Brand awareness and lead generation",
    category: "Marketing",
    department: "Marketing",
    year: 2024,
    q1: 40000,
    q2: 35000,
    q3: 45000,
    q4: 30000,
    total: 150000,
  },
  {
    description: "Equipment Purchases",
    justification: "New machinery for production",
    category: "Capital Expenditure",
    department: "Engineering",
    year: 2024,
    q1: 0,
    q2: 100000,
    q3: 0,
    q4: 0,
    total: 100000,
  },
  {
    description: "Utilities and Facilities",
    justification: "Monthly utility bills and facility maintenance",
    category: "Operating Expenses",
    department: "Administration",
    year: 2024,
    q1: 15000,
    q2: 18000,
    q3: 16000,
    q4: 17000,
    total: 66000,
  },
  {
    description: "Travel and Accommodation",
    justification: "Business travel for client meetings",
    category: "Operating Expenses",
    department: "Marketing",
    year: 2024,
    q1: 12000,
    q2: 8000,
    q3: 15000,
    q4: 10000,
    total: 45000,
  },
  {
    description: "Legal and Professional Services",
    justification: "Legal consultation and compliance",
    category: "Professional Services",
    department: "Administration",
    year: 2024,
    q1: 20000,
    q2: 15000,
    q3: 25000,
    q4: 18000,
    total: 78000,
  },
  {
    description: "Student Services Enhancement",
    justification: "Improving student experience and support",
    category: "Student Services",
    department: "SHS",
    year: 2024,
    q1: 25000,
    q2: 30000,
    q3: 28000,
    q4: 32000,
    total: 115000,
  },
  {
    description: "Educational Technology",
    justification: "Digital learning tools and platforms",
    category: "Technology",
    department: "SHS",
    year: 2024,
    q1: 35000,
    q2: 0,
    q3: 0,
    q4: 0,
    total: 35000,
  },
  {
    description: "Faculty Development",
    justification: "Teacher training and certification",
    category: "Human Resources",
    department: "SHS",
    year: 2024,
    q1: 18000,
    q2: 22000,
    q3: 20000,
    q4: 25000,
    total: 85000,
  },
  {
    description: "Library Resources",
    justification: "Books, journals, and digital resources",
    category: "Educational Resources",
    department: "SHS",
    year: 2024,
    q1: 12000,
    q2: 15000,
    q3: 10000,
    q4: 18000,
    total: 55000,
  },
  {
    description: "Security Systems",
    justification: "Campus security and surveillance",
    category: "Infrastructure",
    department: "Administration",
    year: 2024,
    q1: 0,
    q2: 0,
    q3: 50000,
    q4: 0,
    total: 50000,
  },
];

// Mock departments
export const mockDepartments = [
  "IT",
  "Engineering",
  "Marketing",
  "Administration",
  "SHS",
];

// Mock forecast generation function
export const generateMockForecast = (
  department: string,
  seasonalityPeriod: number = 4,
  alpha: number = 0.5,
  beta: number = 0.3,
  gamma: number = 0.2
): {
  forecasts: ForecastRow[];
  varianceAnalysis: VarianceRow[];
  seasonalEffect: number;
  chartData: {
    quarters: string[];
    actualTotals: number[];
    forecastedTotals: number[];
    actualData: { [key: string]: number[] };
    forecastedData: { [key: string]: number[] };
  };
} => {
  const departmentData = mockData.filter(
    (row) => row.department === department
  );

  const forecasts: ForecastRow[] = departmentData.map((row) => {
    // Simple mock forecasting logic with more realistic seasonal patterns
    const avgQuarterly = row.total / 4;

    // Create more realistic seasonal factors based on department type
    let baseSeasonalFactor = 1.0;
    if (department === "IT") baseSeasonalFactor = 1.05; // IT tends to have steady spending
    if (department === "Marketing") baseSeasonalFactor = 1.15; // Marketing has seasonal campaigns
    if (department === "SHS") baseSeasonalFactor = 1.08; // Education has academic year patterns

    const seasonalFactor = baseSeasonalFactor + (Math.random() - 0.5) * 0.15; // ±7.5% variation

    const forecastedQ1 = Math.round(avgQuarterly * seasonalFactor);
    const forecastedQ2 = Math.round(avgQuarterly * (seasonalFactor + 0.03));
    const forecastedQ3 = Math.round(avgQuarterly * (seasonalFactor - 0.02));
    const forecastedQ4 = Math.round(avgQuarterly * (seasonalFactor + 0.05));

    return {
      ...row,
      forecastedQ1,
      forecastedQ2,
      forecastedQ3,
      forecastedQ4,
      forecastedTotal:
        forecastedQ1 + forecastedQ2 + forecastedQ3 + forecastedQ4,
    };
  });

  const varianceAnalysis: VarianceRow[] = forecasts.map((forecast) => {
    const calculateVariance = (actual: number, forecasted: number) => {
      const variance = forecasted - actual;
      const percentage = ((variance / actual) * 100).toFixed(1);
      return Math.abs(parseFloat(percentage)) > 15
        ? `${percentage}%`
        : variance;
    };

    return {
      ...forecast,
      varianceQ1: calculateVariance(forecast.q1, forecast.forecastedQ1),
      varianceQ2: calculateVariance(forecast.q2, forecast.forecastedQ2),
      varianceQ3: calculateVariance(forecast.q3, forecast.forecastedQ3),
      varianceQ4: calculateVariance(forecast.q4, forecast.forecastedQ4),
      varianceTotal: calculateVariance(
        forecast.total,
        forecast.forecastedTotal
      ),
    };
  });

  // Calculate seasonal effect (difference between forecasted and actual Q1)
  const seasonalEffect =
    forecasts.length > 0 ? forecasts[0].forecastedQ1 - forecasts[0].q1 : 0;

  // Prepare chart data
  const quarters = ["Q1", "Q2", "Q3", "Q4"];

  // Aggregate data across all forecast items for the department
  const actualTotals = quarters.map((_, index) => {
    return forecasts.reduce((sum, forecast) => {
      const quarterKey = `q${index + 1}` as keyof ForecastRow;
      return sum + (forecast[quarterKey] as number);
    }, 0);
  });

  const forecastedTotals = quarters.map((_, index) => {
    return forecasts.reduce((sum, forecast) => {
      const quarterKey = `forecastedQ${index + 1}` as keyof ForecastRow;
      return sum + (forecast[quarterKey] as number);
    }, 0);
  });

  // Individual line item data for detailed charts
  const actualData: { [key: string]: number[] } = {};
  const forecastedData: { [key: string]: number[] } = {};

  forecasts.forEach((forecast) => {
    const key = forecast.description.substring(0, 20) + "...";
    actualData[key] = [forecast.q1, forecast.q2, forecast.q3, forecast.q4];
    forecastedData[key] = [
      forecast.forecastedQ1,
      forecast.forecastedQ2,
      forecast.forecastedQ3,
      forecast.forecastedQ4,
    ];
  });

  const chartData = {
    quarters,
    actualTotals,
    forecastedTotals,
    actualData,
    forecastedData,
  };

  return { forecasts, varianceAnalysis, seasonalEffect, chartData };
};

// Mock summary data for upload simulation
export const getMockSummary = (data: NormalizedRow[]) => {
  const totalBudget = data.reduce((sum, row) => sum + row.total, 0);
  const departments = [...new Set(data.map((row) => row.department))];
  const categories = [...new Set(data.map((row) => row.category))];

  return {
    totalBudget,
    departmentCount: departments.length,
    categoryCount: categories.length,
    proposalTitle: "Departmental Budget Proposal 2024",
  };
};
