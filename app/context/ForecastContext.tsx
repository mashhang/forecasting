"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { type ForecastRow } from "@/lib/mockData";

export interface VarianceAnalysisRow {
  department: string;
  forecast: number;
  proposal: number;
  variance: number;
  percentage: number;
  status: "Approved" | "For Review" | "Disapproved";
}

interface ForecastContextType {
  forecasts: ForecastRow[];
  setForecasts: (forecasts: ForecastRow[]) => void;
  addOrUpdateForecast: (newForecasts: ForecastRow[], department: string) => void;
  clearAllForecasts: () => void;
  varianceData: VarianceAnalysisRow[];
  setVarianceData: (data: VarianceAnalysisRow[]) => void;
  updateVarianceStatus: (department: string, status: "Approved" | "For Review" | "Disapproved") => void;
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
}

const ForecastContext = createContext<ForecastContextType | undefined>(undefined);

export function ForecastProvider({ children }: { children: ReactNode }) {
  const [forecasts, setForecasts] = useState<ForecastRow[]>([]);
  const [varianceData, setVarianceData] = useState<VarianceAnalysisRow[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [isHydrated, setIsHydrated] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedForecasts = localStorage.getItem('forecasts');
      const savedVarianceData = localStorage.getItem('varianceData');
      const savedDepartment = localStorage.getItem('selectedDepartment');

      if (savedForecasts) {
        setForecasts(JSON.parse(savedForecasts));
      }
      if (savedVarianceData) {
        setVarianceData(JSON.parse(savedVarianceData));
      }
      if (savedDepartment) {
        setSelectedDepartment(savedDepartment);
      }
    } catch (error) {
      console.error('Failed to load forecast data from localStorage:', error);
    }
    setIsHydrated(true);
  }, []);

  // Save forecasts to localStorage whenever they change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('forecasts', JSON.stringify(forecasts));
      } catch (error) {
        console.error('Failed to save forecasts to localStorage:', error);
      }
    }
  }, [forecasts, isHydrated]);

  // Save variance data to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('varianceData', JSON.stringify(varianceData));
      } catch (error) {
        console.error('Failed to save variance data to localStorage:', error);
      }
    }
  }, [varianceData, isHydrated]);

  // Save selected department to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('selectedDepartment', selectedDepartment);
      } catch (error) {
        console.error('Failed to save selected department to localStorage:', error);
      }
    }
  }, [selectedDepartment, isHydrated]);

  const addOrUpdateForecast = (newForecasts: ForecastRow[], department: string) => {
    setForecasts((prevForecasts) => {
      // Remove any existing forecasts for this department
      const filtered = prevForecasts.filter((f) => f.department !== department);
      // Add the new forecasts
      return [...filtered, ...newForecasts];
    });
  };

  const clearAllForecasts = () => {
    setForecasts([]);
    setVarianceData([]);
    try {
      localStorage.removeItem('forecasts');
      localStorage.removeItem('varianceData');
    } catch (error) {
      console.error('Failed to clear forecast data from localStorage:', error);
    }
  };

  const updateVarianceStatus = (
    department: string,
    status: "Approved" | "For Review" | "Disapproved"
  ) => {
    setVarianceData((prevData) =>
      prevData.map((row) =>
        row.department === department ? { ...row, status } : row
      )
    );
  };

  return (
    <ForecastContext.Provider
      value={{
        forecasts,
        setForecasts,
        addOrUpdateForecast,
        clearAllForecasts,
        varianceData,
        setVarianceData,
        updateVarianceStatus,
        selectedDepartment,
        setSelectedDepartment,
      }}
    >
      {children}
    </ForecastContext.Provider>
  );
}

export function useForecast() {
  const context = useContext(ForecastContext);
  if (!context) {
    throw new Error("useForecast must be used within a ForecastProvider");
  }
  return context;
}
