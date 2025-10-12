"use client";

import { useSidebar } from "@/app/context/SidebarContext";
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
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<any[]>([]); // State to store logs
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchLogs(); // Fetch logs when component mounts
  }, []);

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
      className={`transition-all duration-300 ease-in-out h-screen
        ${
          isSidebarOpen
            ? "md:ml-64 md:w-[calc(100%-16rem)] px-20"
            : "md:ml-0 w-full"
        }
      `}
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

        {/* System Configuration */}
        {/* <div className="mt-6 rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">System Configuration</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="forecastHorizon"
                className="block text-sm font-medium text-gray-700"
              >
                Forecast Horizon (months)
              </label>
              <input
                type="number"
                id="forecastHorizon"
                className="mt-1 block w-full rounded-md px-3 py-2 border-gray-300 shadow-sm hover:shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g., 12"
              />
            </div>
            <div>
              <label
                htmlFor="outputFormat"
                className="block text-sm font-medium text-gray-700"
              >
                Output Format
              </label>
              <select
                id="outputFormat"
                className="mt-1 block w-full rounded-md px-3 py-2 border-gray-300 shadow-sm hover:shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option selected disabled value="">
                  Select Format
                </option>
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="rounded-xl bg-[var(--brand-gold)] px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-[#fad869] transition-all hover:shadow-md">
              Save Configurations
            </button>
          </div>
        </div> */}

        {/* System Logs */}
        <div className="mt-6 rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">System Logs</h2>
          <div className="mt-4 h-60 overflow-auto rounded-md border bg-gray-50 p-4 text-sm font-mono text-gray-800">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <p key={index}>
                  [{new Date(log.timestamp).toLocaleString()}] {log.level}:{" "}
                  {log.message}
                  {log.userName ? ` (User: ${log.userName})` : ""}
                </p>
              ))
            ) : (
              <p>No system logs available.</p>
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
