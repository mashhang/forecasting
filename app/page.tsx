"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import Image from "next/image";
import { toast } from "sonner";
import Logo2 from "../public/logo2.png";
import getApiUrl from "@/lib/getApiUrl";
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
      const res = await fetch(`${getApiUrl()}/api/auth/login`, {
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
      // Remove hardcoded redirect - let AuthContext handle the redirect based on firstLogin
    } catch (error) {
      console.error("Login Error:", error);
      toast.error((error as Error).message || "Something went wrong");
    } finally {
      setIsLoggingIn(false); // ✅ End loading
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <Image src={Logo2} alt="logo" height={300} width={300} className="mb-4"/>
    <div className="flex justify-center items-center">
      <div className="flex flex-col w-[400px] p-6  shadow-lg rounded-xl">
        <h1 className="text-xl font-semibold text-center">LOGIN</h1>
        <form
          className="mt-4 space-y-2"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          >
          <p className="mb-1 text-gray-800">Email</p>
          <input
            type="text"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm hover:shadow-md transition-all"
            placeholder="name@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
          <p className="mb-1 text-gray-800">Password</p>
          <input
            type="password"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm hover:shadow-md transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            />
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-[var(--brand-green)] text-white hover:bg-[#228057d3] rounded-xl p-2 mt-4 flex justify-center items-center shadow-sm hover:shadow-md transition-all"
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
            </div>
  );
}
