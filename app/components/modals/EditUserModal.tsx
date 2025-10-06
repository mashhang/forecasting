"use client";

import React, { useState, useEffect } from "react";
import getApiUrl from "../../../lib/getApiUrl";

interface User {
  id: string;
  name: string;
  email: string;
  role: "STAFF" | "ADMIN";
  status: "PENDING" | "ACTIVE" | "DEACTIVATED";
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveUser: (user: User) => void;
  currentUser: User | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  onSaveUser,
  currentUser,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"STAFF" | "ADMIN" | "">("");
  const [status, setStatus] = useState<"PENDING" | "ACTIVE" | "DEACTIVATED" | "">("");
  const [logs, setLogs] = useState<any[]>([]);
  
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setRole(currentUser.role);
      setStatus(currentUser.status);
      fetchLogs();
    } else {
      // Reset form if no current user (e.g., when modal closes)
      setName("");
      setEmail("");
      setRole("STAFF");
      setStatus("PENDING");
      fetchLogs();
    }
  }, [currentUser]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      try {
        const response = await fetch(`${getApiUrl()}/api/user/${currentUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, role, status }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update user");
        }

        const updatedUser = await response.json();
        onSaveUser(updatedUser);
        onClose();

        // Log the user edit action
        try {
          const logResponse = await fetch(`${getApiUrl()}/api/log`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              level: "INFO",
              message: `User ${updatedUser.name} (${updatedUser.email}) edited their profile (ID: ${updatedUser.id}).`, // Include email and ID for more detail
              userId: updatedUser.id,
              userName: updatedUser.name,
            }),
          });

          if (!logResponse.ok) {
            console.error("Failed to log user edit action");
          }
        } catch (logError) {
          console.error("Error logging user edit action:", logError);
        }
      } catch (error) {
        console.error("Error updating user:", error);
        // Optionally, show an error message to the user
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-80 md:w-[28rem] rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Edit User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 px-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 px-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              className="mt-1 px-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={role}
              onChange={(e) => setRole(e.target.value as "STAFF" | "ADMIN")}
              required
            >
              <option selected disabled value="">Select Role</option>
              <option value="ADMIN">Admin</option>
              <option value="STAFF">Staff</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              className="mt-1 px-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value as "PENDING" | "ACTIVE" | "DEACTIVATED")}
              required
            >
              <option selected disabled value="">Select Status</option>
              <option value="PENDING">Pending</option>
              <option value="ACTIVE">Active</option>
              <option value="DEACTIVATED">Deactivated</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[var(--brand-gold)] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
