"use client";

import { useSidebar } from "@/app/context/SidebarContext";
import { useSettings } from "@/app/context/SettingsContext";
import AddUserModal from "@/app/components/modals/AddUserModal";
import EditUserModal from "@/app/components/modals/EditUserModal";
import DeleteUserModal from "@/app/components/modals/DeleteUserModal";
import { useState, useEffect } from "react";
import getApiUrl from "../../../lib/getApiUrl";

interface User {
  id: string;
  name: string;
  email: string;
  role: "STAFF" | "ADMIN";
  status: "PENDING" | "ACTIVE" | "DEACTIVATED";
}

export default function AdministrationPage() {
  const { isSidebarOpen } = useSidebar();
  const { refreshSettings } = useSettings();
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<any[]>([]); // State to store logs
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [settings, setSettings] = useState({
    variancePercentage: 10,
    inflationRate: 3.5,
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<string>("");

  useEffect(() => {
    fetchUsers();
    fetchLogs(); // Fetch logs when component mounts
    fetchSettings(); // Fetch settings when component mounts
  }, []);

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
    }
  };

  const handleSaveSettings = async () => {
    setSettingsLoading(true);
    setSettingsMessage("");
    try {
      const response = await fetch(`${getApiUrl()}/api/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variancePercentage: settings.variancePercentage,
          inflationRate: settings.inflationRate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      setSettingsMessage("Settings saved successfully!");
      await refreshSettings(); // Refresh global settings cache
      setTimeout(() => setSettingsMessage(""), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setSettingsMessage("Failed to save settings");
      setTimeout(() => setSettingsMessage(""), 3000);
    } finally {
      setSettingsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/api/user`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data: User[] = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/api/log`);
      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const handleAddUser = (user: any) => {
    console.log("Adding user:", user);
    fetchUsers(); // Refresh the list after adding a user
    fetchLogs(); // Also refresh logs after adding a user
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setIsEditUserModalOpen(true);
    fetchUsers(); // User made a change which should be reflected
    fetchLogs(); // Also refresh logs after editing a user
  };

  const handleSaveUser = async (updatedUser: User) => {
    console.log("Saving user:", updatedUser);
    fetchUsers(); // Refresh the list after saving a user
    fetchLogs(); // Also refresh logs after saving a user
    setIsEditUserModalOpen(false);
    setCurrentUser(null);
  };

  // const handleDeleteClick = (user: User) => {
  //   setUserToDelete(user);
  //   setIsDeleteUserModalOpen(true);
  //   fetchUsers();
  //   fetchLogs();
  // };

  // const handleDeleteUser = async () => {
  //   if (userToDelete) {
  //     try {
  //       const response = await fetch(`${getApiUrl()}/api/user/${userToDelete.id}`, {
  //         method: "DELETE",
  //       });

  //       if (!response.ok) {
  //         const errorData = await response.json();
  //         throw new Error(errorData.error || "Failed to delete user");
  //       }

  //       fetchUsers();
  //       fetchLogs();
  //       onCloseDeleteModal();
  //     } catch (error) {
  //       console.error("Error deleting user:", error);
  //     }
  //   }
  // };

  // const onCloseDeleteModal = () => {
  //   setIsDeleteUserModalOpen(false);
  //   setUserToDelete(null);
  // };

  return (
    <div
      className={`transition-all duration-300 ease-in-out h-screen md:ml-64 md:w-[calc(100%-16rem)] px-20`}
      /*${
          isSidebarOpen
            ? "md:ml-64 md:w-[calc(100%-16rem)] px-20"
            : "md:ml-0 w-full"
        }*/
    >
      <div className="mx-auto max-w-[1600px] mt-4">
        <div className="rounded-2xl border bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">User & Role Management</h2>
            <button
              className="rounded-xl bg-[var(--brand-gold)] hover:bg-[#fad869] px-3 py-2 transition-all shadow-sm hover:shadow-md"
              onClick={() => setIsAddUserModalOpen(true)}
            >
              Add User
            </button>
          </div>
          <div className="mt-4 overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-3 py-2">{user.name}</td>
                    <td className="px-3 py-2">{user.email}</td>
                    <td className="px-3 py-2">{user.role}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          user.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : user.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="space-x-2 px-3 py-2">
                      <button
                        className="rounded-lg border px-3 py-2 text-xs shadow-sm hover:shadow-md"
                        onClick={() => handleEditUser(user)}
                      >
                        Edit
                      </button>
                      {/* <button
                        className="rounded-lg border border-red-500 px-2 py-1 text-xs text-red-500 shadow-sm hover:shadow-md"
                        onClick={() => handleDeleteClick(user)}
                      >
                        Delete
                      </button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Settings */}
        <div className="mt-6 rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">System Settings</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="variancePercentage"
                className="block text-sm font-medium text-gray-700"
              >
                Variance Percentage (%)
              </label>
              <input
                type="number"
                id="variancePercentage"
                step="0.1"
                min="0"
                max="100"
                value={settings.variancePercentage}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    variancePercentage: parseFloat(e.target.value) || 0,
                  })
                }
                className="mt-1 block w-full rounded-xl border px-3 py-2 shadow-sm focus:border-[var(--brand-gold)] focus:ring-[var(--brand-gold)] sm:text-sm"
                placeholder="e.g., 10"
              />
              <p className="mt-1 text-xs text-gray-500">
                Threshold percentage for flagging budget variances
              </p>
            </div>
            <div>
              <label
                htmlFor="inflationRate"
                className="block text-sm font-medium text-gray-700"
              >
                Inflation Rate (%)
              </label>
              <input
                type="number"
                id="inflationRate"
                step="0.1"
                min="0"
                max="100"
                value={settings.inflationRate}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    inflationRate: parseFloat(e.target.value) || 0,
                  })
                }
                className="mt-1 block w-full rounded-xl border px-3 py-2 shadow-sm focus:border-[var(--brand-gold)] focus:ring-[var(--brand-gold)] sm:text-sm"
                placeholder="e.g., 3.5"
              />
              <p className="mt-1 text-xs text-gray-500">
                Annual inflation rate for budget adjustments
              </p>
            </div>
          </div>
          {settingsMessage && (
            <div
              className={`mt-4 rounded-xl p-3 text-sm ${
                settingsMessage.includes("success")
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {settingsMessage}
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={settingsLoading}
              className="rounded-xl bg-[var(--brand-gold)] px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-[#fad869] transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {settingsLoading ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>

        {/* System Logs */}
        <div className="mt-6 rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">System Logs</h2>
          <div className="mt-4 overflow-auto">
            {logs.length > 0 ? (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-3 py-2">Timestamp</th>
                    <th className="px-3 py-2">Level</th>
                    <th className="px-3 py-2">Message</th>
                    <th className="px-3 py-2">User</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[...logs].reverse().map((log, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 text-gray-600">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            log.level === "ERROR"
                              ? "bg-red-100 text-red-700"
                              : log.level === "WARN"
                              ? "bg-yellow-100 text-yellow-700"
                              : log.level === "INFO"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {log.level}
                        </span>
                      </td>
                      <td className="px-3 py-2">{log.message}</td>
                      <td className="px-3 py-2 text-gray-600">
                        {log.userName || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="rounded-md border bg-gray-50 p-4 text-sm text-gray-600">
                No system logs available.
              </div>
            )}
          </div>
        </div>
      </div>

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAddUser={handleAddUser}
      />

      <EditUserModal
        isOpen={isEditUserModalOpen}
        onClose={() => setIsEditUserModalOpen(false)}
        onSaveUser={handleSaveUser}
        currentUser={currentUser}
      />

      {/* <DeleteUserModal
        isOpen={isDeleteUserModalOpen}
        onClose={onCloseDeleteModal}
        onConfirmDelete={handleDeleteUser}
        userName={userToDelete?.name || ""}
      /> */}
    </div>
  );
}
