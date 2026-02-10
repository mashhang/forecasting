"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import getApiUrl from "@/lib/getApiUrl";

type Settings = {
  variancePercentage: number;
  inflationRate: number;
};

type SettingsContextType = {
  settings: Settings | null;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/api/settings`);
      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }
      const data = await response.json();
      setSettings({
        variancePercentage: data.variancePercentage || 10,
        inflationRate: data.inflationRate || 3.5,
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
      // Set default values on error
      setSettings({
        variancePercentage: 10,
        inflationRate: 3.5,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const refreshSettings = async () => {
    setIsLoading(true);
    await fetchSettings();
  };

  return (
    <SettingsContext.Provider value={{ settings, isLoading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
