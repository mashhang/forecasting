"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import Image from "next/image";
import { toast } from "sonner";
import Logo from "../../public/logo.png";
import API_URL from "@/lib/getApiUrl";
import { CgSpinner } from "react-icons/cg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const { user, isLoading } = useAuth(); // 👈 Get auth state
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // prevent flicker
  if (isLoading || user) return null;

  const handleLogin = async () => {
    if (!email.trim() && !password.trim()) {
      toast.error("Please enter your username.");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    if (!password.trim()) {
      toast.error("Please enter your password.");
      return;
    }

    try {
      setIsLoggingIn(true);
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("token", data.token);
      login(data.user, data.token);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      toast.error((error as Error).message || "Something went wrong");
    } finally {
      setIsLoggingIn(false); // ✅ End loading
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="flex flex-col w-[400px] p-6 border border-black rounded-xl">
        <h1 className="text-lg font-semibold">Login</h1>
        <form
          className="mt-4 space-y-2"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <p>Email</p>
          <input
            type="text"
            className="w-full rounded-xl border px-3 py-2"
            placeholder="name@loa.edu.ph"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p>Password</p>
          <input
            type="password"
            className="w-full rounded-xl border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-[var(--brand-green)] text-white hover:bg-[#228057d3] rounded-xl p-2 mt-4 flex justify-center items-center"
          >
            {isLoggingIn ? (
              <>
                <CgSpinner className="animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              "SIGN IN"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
