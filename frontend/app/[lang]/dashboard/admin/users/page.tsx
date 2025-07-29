"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../../../../lib/auth-context";
import { useDictionary } from "../../../../../lib/hooks/useDictionary";
import { getUsers, updateUser, deleteUser } from "../../../../../lib/api";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Input } from "../../../../../components/ui/input";
import { IconSearch, IconEdit, IconTrash, IconUser, IconCheck, IconX } from "@tabler/icons-react";

interface User {
  _id: string;
  username: string;
  email: string;
  role: "customer" | "admin";
  isActive: boolean;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useDictionary();
  const params = useParams();
  const lang = params.lang as string;
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push(`/${lang}/login`);
    }
  }, [user, router, lang]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getUsers({
          search: search || undefined,
          role: role !== "all" ? (role as "customer" | "admin") : undefined,
          isActive: status === "all" ? undefined : status === "active",
        });
        if (response.success && response.data?.users) {
          setUsers(response.data.users);
        }
      } catch (error) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === "admin") {
      fetchUsers();
    }
  }, [user, search, role, status, refresh]);

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    await updateUser(userId, { isActive: !isActive });
    setRefresh((r) => r + 1);
  };

  const handleDelete = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await deleteUser(userId);
      setRefresh((r) => r + 1);
    }
  };

  const handleChangeRole = async (userId: string, currentRole: "customer" | "admin") => {
    const newRole = currentRole === "admin" ? "customer" : "admin";
    await updateUser(userId, { role: newRole });
    setRefresh((r) => r + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{t.ui.loading}</div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage all users and permissions</p>
        </div>
        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconUser className="w-5 h-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Search</label>
                <div className="relative">
                  <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by username, email, name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Tabla de usuarios */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className="px-4 py-2 font-medium">{u.username}</td>
                      <td className="px-4 py-2">{u.email}</td>
                      <td className="px-4 py-2 capitalize">{u.role}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-2 space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleActive(u._id, u.isActive)}
                          className={u.isActive ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                        >
                          {u.isActive ? <IconX className="w-4 h-4" /> : <IconCheck className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleChangeRole(u._id, u.role)}
                        >
                          <IconEdit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(u._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <IconTrash className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center py-8 text-gray-500">No users found</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 