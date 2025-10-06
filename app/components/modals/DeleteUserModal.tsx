"use client";

import React from "react";
import getApiUrl from "../../../lib/getApiUrl";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  userName: string;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  onClose,
  onConfirmDelete,
  userName,
}) => {
  if (!isOpen) return null;

  const handleDeleteAndLog = async () => {
    await onConfirmDelete();

    // Log the user deletion action
    try {
      const logResponse = await fetch(`${getApiUrl()}/api/log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          level: "INFO",
          message: `User ${userName} deleted.`, // Customize as needed
          // userId: userToDelete.id, // Cannot access userToDelete here directly
          userName: userName,
        }),
      });

      if (!logResponse.ok) {
        console.error("Failed to log user deletion action");
      }
    } catch (logError) {
      console.error("Error logging user deletion action:", logError);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Confirm Deletion</h2>
        <p className="mb-4">
          Are you sure you want to delete user `<strong>{userName}</strong>`?
          This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={handleDeleteAndLog}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
