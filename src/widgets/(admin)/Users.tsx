"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  customClaims?: {
    role?: string;
    status?: string;
  };
}

type SortOption = "name-asc" | "name-desc" | "email-asc" | "email-desc";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/users");
        const data = await res.json();

        if (res.ok) {
          setUsers(data.users);
          setFilteredUsers(data.users);
        } else {
          setError(data.error || "Failed to fetch users");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
  // Filter users based on search term
  let results = users;
  if (searchTerm) {
    results = users.filter(user => 
      (user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    ) // <-- This closing parenthesis was missing
  }

  // Sort users
  results = [...results].sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return (a.displayName || "").localeCompare(b.displayName || "");
      case "name-desc":
        return (b.displayName || "").localeCompare(a.displayName || "");
      case "email-asc":
        return (a.email || "").localeCompare(b.email || "");
      case "email-desc":
        return (b.email || "").localeCompare(a.email || "");
      default:
        return 0;
    }
  });

  setFilteredUsers(results);
}, [searchTerm, sortOption, users]);

  if (loading) return <div className="p-4">Loading users...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">
            {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"}
          </span>
          
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="border rounded px-2 py-1"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="email-asc">Email (A-Z)</option>
            <option value="email-desc">Email (Z-A)</option>
          </select>
          
          <button
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="border rounded px-2 py-1"
          >
            {viewMode === "grid" ? "List View" : "Grid View"}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded outline-primary-600 placeholder:text-gray-500"
        />
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <UserCard key={user.uid} user={user} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <UserListItem key={user.uid} user={user} />
          ))}
        </div>
      )}

      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? "No matching users found" : "No users found"}
        </div>
      )}
    </div>
  );
}

function UserCard({ user }: { user: User }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4 mb-3">
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt={user.displayName || "User avatar"}
            width={48}
            height={48}
            className="rounded-full"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary-200 flex items-center justify-center text-gray-500">
            {user.email?.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <h2 className="font-semibold">
            {user.displayName || "No name provided"}
          </h2>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <p>
          <span className="font-medium">Status:</span>{" "}
          {user.customClaims?.status || "Active"}
        </p>
        <p>
          <span className="font-medium">Role:</span>{" "}
          {user.customClaims?.role || "User"}
        </p>
        <p>
          <span className="font-medium">UID:</span> {user.uid}
        </p>
        <p>
          <span className="font-medium">Verified:</span>{" "}
          {user.emailVerified ? "Yes" : "No"}
        </p>
      </div>
    </div>
  );
}

function UserListItem({ user }: { user: User }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex items-start">
      <div className="mr-4">
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt={user.displayName || "User avatar"}
            width={64}
            height={64}
            className="rounded-full"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary-200 flex items-center justify-center text-gray-500 text-xl">
            {user.email?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
          <h2 className="font-semibold text-lg">
            {user.displayName || "No name provided"}
          </h2>
          <p className="text-gray-600">{user.email}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Status:</span>{" "}
            {user.customClaims?.status || "Active"}
          </div>
          <div>
            <span className="font-medium">Role:</span>{" "}
            {user.customClaims?.role || "User"}
          </div>
          <div>
            <span className="font-medium">Verified:</span>{" "}
            {user.emailVerified ? "Yes" : "No"}
          </div>
          <div className="truncate">
            <span className="font-medium">UID:</span> {user.uid}
          </div>
        </div>
      </div>
    </div>
  );
}