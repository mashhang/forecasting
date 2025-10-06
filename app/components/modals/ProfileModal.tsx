"use client";

import { useState, useEffect } from "react";
import getApiUrl from "@/lib/getApiUrl";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const ProfileModal = ({ id }: { id: string }) => {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    createdAt: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${getApiUrl()}/api/user/${id}`);
        if (!response.ok) {
          throw new Error("User not found");
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading)
    return <p className="text-sm md:text-base">Loading user data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-base md:text-xl font-semibold mb-2 md:mb-4">
        My Account
      </h2>
      <p className="text-sm md:text-base">
        <strong>Name:</strong> {user?.name}
      </p>
      <p className="text-sm md:text-base">
        <strong>Email:</strong> {user?.email}
      </p>
      <p className="text-sm md:text-base">
        <strong>Joined:</strong>{" "}
        {user?.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : "N/A"}
      </p>
    </div>
  );
};

export default ProfileModal;
