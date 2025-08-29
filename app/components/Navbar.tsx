"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import logo from "@/public/logo.png";
import Image from "next/image";
// import ProfileModal from "@/app/components/modals/ProfileModal";
// import SettingsModal from "@/app/components/modals/SettingsModal";
// import HelpModal from "@/app/components/modals/HelpModal";
// import API_URL from "@/lib/getApiUrl";
import { UserRound, LogOut } from "lucide-react";

type NavbarProps = {
  isAuthenticated: boolean;
  isSidebarOpen: boolean;
  isProfileOpen: boolean;
  toggleProfile: () => void;
  toggleSidebar: () => void;
};

const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated,
  isSidebarOpen,
  isProfileOpen,
  toggleProfile,
  toggleSidebar,
}) => {
  const pathname = usePathname();
  const { user, logout } = useAuth(); // ✅ Get user from AuthContext

  if (pathname === "/login") return null; // Hide on login
  if (pathname === "/register") return null; // Hide on login

  const [modalContent, setModalContent] = useState<string | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const links =
    user?.role === "ADMIN"
      ? [
          {
            label: "Dashboard",
            href: "/admin",
          },
          {
            label: "⚙️ Administration",
            href: "/administration",
          },
        ]
      : [
          {
            label: "🏠 Dashboard",
            href: "/dashboard",
          },
          {
            label: "🗂️ Data Management",
            href: "/datamanagement",
          },
          {
            label: "📈 Forecasting (Holt–Winters)",
            href: "/forecasting",
          },
          {
            label: "📊 Variance Analysis",
            href: "/varianceanalysis",
          },
          {
            label: "📝 Report Generation",
            href: "/report",
          },
          {
            label: "🔔 Notifications",
            href: "/notifications",
          },
        ];

  const profilelinks = [
    {
      label: "Profile",
      action: () => setModalContent("profile"),
    },
    {
      label: "Settings",
      action: () => setModalContent("settings"),
    },
    {
      label: "Help",
      action: () => setModalContent("help"),
    },
  ];

  const currentPath = usePathname();
  console.log(currentPath);

  // Close the profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        toggleProfile(); // Close profile menu
      }
    }
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setModalContent(null); // Close modal
      }
    }
    if (modalContent) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalContent]);

  return (
    <>
      <nav className="sticky top-0 p-1 z-40 border-b border-gray-200 bg-[var(--brand-white)]">
        <div
          className={`flex ${
            !isAuthenticated ? "justify-between" : "justify-center"
          } mx-6 `}
        >
          <div className="flex space-x-2">
            {!isAuthenticated && (
              <button
                onClick={toggleSidebar}
                className="rounded-md hover:bg-gray-200 hover:transition-all p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 rounded-full">
                <Link href={user?.role === "ADMIN" ? "/admin" : "/dashboard"}>
                  <Image
                    className="p-1"
                    src={logo}
                    alt="logo"
                    height={40}
                    width={40}
                    priority
                    unoptimized={true}
                  />
                </Link>
              </div>
              <div>
                <h1 className="text-lg font-semibold sm:text-xl">
                  Lyceum of Alabang
                </h1>
                <p className="text-xs text-gray-500">
                  Departmental Quarterly Budget Forecasting
                </p>
              </div>
            </div>
          </div>

          {!isAuthenticated && (
            <button
              onClick={toggleProfile}
              className="flex place-items-center rounded-md hover:bg-gray-200 hover:transition-all p-1 "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1"
                stroke="currentColor"
                className="size-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>
          )}
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`${
          !isAuthenticated ? "opacity-100" : "opacity-0 pointer-events-none"
        }}`}
      >
        <nav
          className={`fixed left-0 top-10 z-30 h-[calc(100vh-4rem)] w-64 border-r border-gray-200 bg-[var(--brand-white)] p-4 transition-transform duration-300 transform font-[300]
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-gray-1000">
              Sidebar
            </div>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex w-full gap-2 rounded-xl px-3 py-2 text-left hover:bg-gray-100 hover:text-black font-normal hover:transition-all ${
                  link.href === currentPath
                    ? "bg-[var(--brand-green)] text-white"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Profile Menu */}
      {isProfileOpen && !modalContent && (
        <div
          ref={profileRef}
          className="fixed top-[3rem] right-0 mr-6 rounded-md w-[14rem] bg-white border border-[#bebebe] shadow-lg z-50"
        >
          <div className="mt-2">
            <div className="w-full flex justify-center">
              <UserRound strokeWidth={1.5} className="size-14" />
            </div>
            <div className="text-center mb-2">
              {/* ✅ Show logged-in user name */}
              <p className="font-[350]">
                {user?.firstName} {user?.lastName || "Guest"}
              </p>
              <p className="text-[#3C3C3C] font-[250] text-[12px]">
                <strong>ID:</strong>
                <span>{user?.studentId || "ID"}</span>
              </p>
            </div>
            {profilelinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  setModalContent(link.label.toLowerCase());
                  toggleProfile();
                }}
                className="flex w-full pl-5 p-2 hover:bg-zinc-300 text-left"
              >
                {link.label}
              </button>
            ))}
            <div className="mt-4 mb-1 h-[1px] w-full bg-[#E6E6E6]" />
            <button
              onClick={() => {
                console.log("Logging out...");
                logout(); // ✅ Call logout function properly
              }}
              className="flex w-full pl-5 p-2 hover:bg-zinc-300 text-left"
            >
              <span className="mr-3">
                <LogOut strokeWidth={1.25} />
              </span>
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Centered Popup Modal */}
      {/* {modalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg w-80 md:w-[28rem] p-6 shadow-lg relative"
          >
            <button
              onClick={() => setModalContent(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              <X strokeWidth={1.5} />
            </button>
            {modalContent === "profile" && user?.id && (
              <ProfileModal userId={user.id} />
            )}
            {modalContent === "settings" && <SettingsModal />}
            {modalContent === "help" && <HelpModal />}
          </div>
        </div>
      )} */}
    </>
  );
};

export default Navbar;
