"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { Users, Shield, UserCheck, Search, Loader2 } from "lucide-react";

const API_URL = "";

type UserItem = {
  _id: string;
  id?: string;
  name: string;
  email: string;
  image?: string;
  role: "customer" | "technician" | "admin";
  phone?: string;
  area?: string;
  createdAt?: string;
};

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const currentAdminEmail = session?.user?.email;

  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/admin/users`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Unable to fetch users.");
      }

      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch users error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (targetUser: UserItem, newRole: string) => {
    if (targetUser.email === currentAdminEmail) {
      toast.error("Admins cannot change their own role.");
      return;
    }

    try {
      setUpdatingId(targetUser._id);

      const res = await fetch(
        `${API_URL}/api/admin/users/${targetUser._id}/role`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ role: newRole }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update role.");
      }

      toast.success(`Role for ${targetUser.name} updated to ${newRole}.`);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === targetUser._id
            ? { ...u, role: newRole as UserItem["role"] }
            : u,
        ),
      );
    } catch (err) {
      console.error("Role update error:", err);
      toast.error(err instanceof Error ? err.message : "Role update failed.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy dark:text-on-dark">
            Manage Users
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-foreground/60 dark:text-on-dark/60">
            View all platform accounts and update their authorization roles.
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center rounded-xl border border-foreground/15 bg-white px-3 py-2 text-xs sm:text-sm dark:border-white/15 dark:bg-surface/40 w-full sm:w-72">
          <Search className="h-4 w-4 text-foreground/40 mr-2 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or role..."
            className="w-full bg-transparent outline-none text-foreground dark:text-on-dark"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-white shadow-sm dark:border-white/10 dark:bg-surface/40">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-foreground/50">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading accounts...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-sm text-foreground/50">
            No users found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-foreground/10 bg-foreground/[0.02] dark:border-white/10 dark:bg-white/[0.02]">
                <tr>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-foreground/50 dark:text-on-dark/50">
                    User
                  </th>
                  <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-foreground/50 dark:text-on-dark/50">
                    Email
                  </th>
                  <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-foreground/50 dark:text-on-dark/50">
                    Current Role
                  </th>
                  <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-foreground/50 dark:text-on-dark/50">
                    Change Role
                  </th>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-foreground/50 dark:text-on-dark/50 text-right">
                    Joined Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/8 dark:divide-white/8">
                {filteredUsers.map((u) => {
                  const isCurrentAdmin = u.email === currentAdminEmail;
                  return (
                    <tr
                      key={u._id}
                      className="hover:bg-foreground/[0.015] dark:hover:bg-white/[0.02] transition"
                    >
                      {/* Name + Avatar */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border border-foreground/10 bg-primary/10 text-sm font-bold text-primary dark:border-white/10">
                            {u.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={u.image}
                                alt={u.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              u.name?.charAt(0).toUpperCase() || "U"
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-navy dark:text-on-dark truncate max-w-[160px]">
                              {u.name}
                            </p>
                            {u.phone && (
                              <p className="text-[11px] text-foreground/50 dark:text-on-dark/50">
                                {u.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-4 text-foreground/70 dark:text-on-dark/70 font-mono text-xs">
                        {u.email}
                      </td>

                      {/* Role Badge */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                            u.role === "admin"
                              ? "bg-purple-500/10 text-purple-600 dark:bg-purple-400/15 dark:text-purple-300"
                              : u.role === "technician"
                                ? "bg-sky-500/10 text-sky-600 dark:bg-sky-400/15 dark:text-sky-300"
                                : "bg-blue-500/10 text-blue-600 dark:bg-blue-400/15 dark:text-blue-300"
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {u.role}
                        </span>
                      </td>

                      {/* Role Selector */}
                      <td className="px-4 py-4">
                        {isCurrentAdmin ? (
                          <span className="text-[11px] font-medium text-foreground/40 italic">
                            Cannot change own role
                          </span>
                        ) : (
                          <select
                            disabled={updatingId === u._id}
                            value={u.role}
                            onChange={(e) =>
                              handleRoleChange(u, e.target.value)
                            }
                            className="rounded-lg border border-foreground/15 bg-background px-3 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-primary dark:border-white/15 dark:text-on-dark cursor-pointer disabled:opacity-50"
                          >
                            <option value="customer">customer</option>
                            <option value="technician">technician</option>
                            <option value="admin">admin</option>
                          </select>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="px-5 py-4 text-right text-xs text-foreground/55 dark:text-on-dark/55">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
