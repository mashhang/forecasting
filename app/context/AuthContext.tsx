"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  Name: string;
  email: string;
  role: "STAFF" | "ADMIN";
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  // Effect for initial loading from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      // Redirect only if on auth or landing page
      const pathname = window.location.pathname;
      if (pathname === "/") {
        const parsedUser = JSON.parse(storedUser);
        const destination =
          parsedUser.role === "ADMIN" ? "/admin" : "/dashboard";
        router.push(destination);
      }
    }
    setIsLoading(false); // Set loading to false after initial check
  }, []); // Run only once on mount

  // Effect for handling storage changes
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "token" || event.key === "user") {
        const newToken = localStorage.getItem("token");
        const storedUserChange = localStorage.getItem("user");

        if (!newToken || !storedUserChange) {
          setUser(null);
          setToken(null);
          router.push("/");
          return;
        }

        const parsedUser = JSON.parse(storedUserChange);
        setUser(parsedUser);
        setToken(newToken);

        // Redirect only if on auth or landing page
        const pathname = window.location.pathname;
        if (pathname === "/") {
          const destination =
            parsedUser.role === "ADMIN" ? "/admin" : "/dashboard";
          router.push(destination);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [router]); // Re-run if router changes

  const login = (userData: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
    setToken(token);
    router.push(userData.role === "ADMIN" ? "/admin" : "/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
