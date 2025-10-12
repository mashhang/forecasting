"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ForecastRow } from "@/lib/mockData";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ForecastChartProps {
  forecasts: ForecastRow[];
  department: string;
  chartData?: {
    quarters: string[];
    actualTotals: number[];
    forecastedTotals: number[];
    actualData: { [key: string]: number[] };
    forecastedData: { [key: string]: number[] };
  };
}

export default function ForecastChart({
  forecasts,
  department,
  chartData,
}: ForecastChartProps) {
  if (forecasts.length === 0) {
    return (
      <div className="flex items-center justify-center h-56 text-gray-500">
        No forecast data available
      </div>
    );
  }

  // Use provided chart data or calculate from forecasts
  const quarters = chartData?.quarters || ["Q1", "Q2", "Q3", "Q4"];
  const actualData =
    chartData?.actualTotals ||
    quarters.map((_, index) => {
      return forecasts.reduce((sum, forecast) => {
        const quarterKey = `q${index + 1}` as keyof ForecastRow;
        return sum + (forecast[quarterKey] as number);
      }, 0);
    });

  const forecastData =
    chartData?.forecastedTotals ||
    quarters.map((_, index) => {
      return forecasts.reduce((sum, forecast) => {
        const quarterKey = `forecastedQ${index + 1}` as keyof ForecastRow;
        return sum + (forecast[quarterKey] as number);
      }, 0);
    });

  const chartConfig = {
    labels: quarters,
    datasets: [
      {
        label: "Actual Data",
        data: actualData,
        borderColor: "rgb(59, 130, 246)", // Blue
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "rgb(59, 130, 246)",
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: "Forecasted Data",
        data: forecastData,
        borderColor: "rgb(34, 197, 94)", // Green
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        pointBackgroundColor: "rgb(34, 197, 94)",
        pointBorderColor: "rgb(34, 197, 94)",
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: "Inter, sans-serif",
          },
        },
      },
      title: {
        display: true,
        text: `${department} Department - Actual vs Forecasted Budget`,
        font: {
          size: 16,
          weight: "bold" as const,
          family: "Inter, sans-serif",
        },
        color: "#374151",
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            const value = context.parsed.y;
            return `${context.dataset.label}: ₱${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: "Inter, sans-serif",
          },
          color: "#6b7280",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 12,
            family: "Inter, sans-serif",
          },
          color: "#6b7280",
          callback: function (value: any) {
            return `₱${(value / 1000).toFixed(0)}k`;
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    elements: {
      point: {
        hoverBorderWidth: 3,
      },
    },
  };

  return (
    <div className="h-56 w-full">
      <Line data={chartConfig} options={options} />
    </div>
  );
}
