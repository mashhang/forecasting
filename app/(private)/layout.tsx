"use client";

import { useState } from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useAuth } from "@/app/context/AuthContext";
import { SidebarProvider, useSidebar } from "@/app/context/SidebarContext";
import Navbar from "../components/Navbar";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <InnerLayout>{children}</InnerLayout>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

function InnerLayout({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleProfile = () => setIsProfileOpen((prev) => !prev);

  return (
    <>
      <Navbar
        isAuthenticated={!!useAuth().user}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isProfileOpen={isProfileOpen}
        toggleProfile={toggleProfile}
      />
      <main>{children}</main>
    </>
  );
}
