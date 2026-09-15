
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Search,
  ShieldCheck,
  UserCheck,
  UserCog,
  UserPlus,
  UserX,
  Users,
  X,
} from "lucide-react";

type UserRole =
  | "user"
  | "admin"
  | "super-admin"
  | "question-manager"
  | "exam-manager"
  | "result-manager"
  | "user-manager";

type UserStatus = "Active" | "Blocked";

type Permission = {
  id: string;
  name: string;
  description: string;
  category: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joined: string;
  permissions: string[];
};

const permissions: Permission[] = [
  {
    id: "dashboard.view",
    name: "View Dashboard",
    description: "Access admin dashboard and statistics.",
    category: "Dashboard",
  },

  {
    id: "users.view",
    name: "View Users",
    description: "View registered users.",
    category: "Users",
  },
  {
    id: "users.create",
    name: "Create Users",
    description: "Create new user accounts.",
    category: "Users",
  },
  {
    id: "users.edit",
    name: "Edit Users",
    description: "Update user information.",
    category: "Users",
  },
  {
    id: "users.delete",
    name: "Delete Users",
    description: "Delete user accounts.",
    category: "Users",
  },

  {
    id: "questions.view",
    name: "View Questions",
    description: "View the question bank.",
    category: "Questions",
  },
  {
    id: "questions.create",
    name: "Create Questions",
    description: "Add new questions.",
    category: "Questions",
  },
  {
    id: "questions.edit",
    name: "Edit Questions",
    description: "Edit existing questions.",
    category: "Questions",
  },
  {
    id: "questions.delete",
    name: "Delete Questions",
    description: "Delete questions.",
    category: "Questions",
  },

  {
    id: "exams.view",
    name: "View Exams",
    description: "View exams and subjects.",
    category: "Exams",
  },
  {
    id: "exams.create",
    name: "Create Exams",
    description: "Create new exams.",
    category: "Exams",
  },
  {
    id: "exams.edit",
    name: "Edit Exams",
    description: "Edit exam information.",
    category: "Exams",
  },
  {
    id: "exams.delete",
    name: "Delete Exams",
    description: "Delete exams.",
    category: "Exams",
  },

  {
    id: "mock-tests.view",
    name: "View Mock Tests",
    description: "View mock tests.",
    category: "Mock Tests",
  },
  {
    id: "mock-tests.create",
    name: "Create Mock Tests",
    description: "Create mock tests.",
    category: "Mock Tests",
  },
  {
    id: "mock-tests.edit",
    name: "Edit Mock Tests",
    description: "Edit mock tests.",
    category: "Mock Tests",
  },
  {
    id: "mock-tests.delete",
    name: "Delete Mock Tests",
    description: "Delete mock tests.",
    category: "Mock Tests",
  },

  {
    id: "results.view",
    name: "View Results",
    description: "View student results.",
    category: "Results",
  },
  {
    id: "results.delete",
    name: "Delete Results",
    description: "Delete stored results.",
    category: "Results",
  },

  {
    id: "settings.view",
    name: "View Settings",
    description: "Access platform settings.",
    category: "Settings",
  },
  {
    id: "settings.edit",
    name: "Edit Settings",
    description: "Change platform settings.",
    category: "Settings",
  },

  {
    id: "permissions.view",
    name: "View Permissions",
    description: "View roles and permissions.",
    category: "Permissions",
  },
  {
    id: "permissions.edit",
    name: "Edit Permissions",
    description: "Change assigned permissions.",
    category: "Permissions",
  },
];

const allPermissionIds = permissions.map(
  (permission) => permission.id,
);

const initialUsers: User[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "aarav@example.com",
    role: "user",
    status: "Active",
    joined: "15 Sep 2026",
    permissions: ["dashboard.view"],
  },
  {
    id: 2,
    name: "Priya Singh",
    email: "priya@example.com",
    role: "user",
    status: "Active",
    joined: "14 Sep 2026",
    permissions: ["dashboard.view"],
  },
  {
    id: 3,
    name: "Radheshyam",
    email: "user@example.com",
    role: "admin",
    status: "Active",
    joined: "12 Sep 2026",
    permissions: [
      "dashboard.view",
      "users.view",
      "users.create",
      "users.edit",
      "questions.view",
      "questions.create",
      "questions.edit",
      "questions.delete",
      "exams.view",
      "exams.create",
      "exams.edit",
      "exams.delete",
      "mock-tests.view",
      "mock-tests.create",
      "mock-tests.edit",
      "mock-tests.delete",
      "results.view",
      "settings.view",
    ],
  },
  {
    id: 4,
    name: "Neha Verma",
    email: "neha@example.com",
    role: "user",
    status: "Blocked",
    joined: "10 Sep 2026",
    permissions: [],
  },
];

const roleOptions: {
  value: UserRole;
  label: string;
  description: string;
}[] = [
  {
    value: "user",
    label: "User",
    description: "Practice exams and view personal results.",
  },
  {
    value: "admin",
    label: "Admin",
    description: "Manage users, exams, questions and results.",
  },
  {
    value: "super-admin",
    label: "Super Admin",
    description: "Full access to the administration portal.",
  },
  {
    value: "question-manager",
    label: "Question Manager",
    description: "Manage questions and question banks.",
  },
  {
    value: "exam-manager",
    label: "Exam Manager",
    description: "Manage exams and mock tests.",
  },
  {
    value: "result-manager",
    label: "Result Manager",
    description: "View and manage student results.",
  },
  {
    value: "user-manager",
    label: "User Manager",
    description: "Manage registered users.",
  },
];

function getRoleLabel(role: UserRole) {
  return (
    roleOptions.find((item) => item.value === role)?.label ??
    role
  );
}

function getRoleStyle(role: UserRole) {
  switch (role) {
    case "super-admin":
      return "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300";

    case "admin":
      return "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300";

    case "question-manager":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";

    case "exam-manager":
      return "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300";

    case "result-manager":
      return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";

    case "user-manager":
      return "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300";

    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);
  const [roleOpen, setRoleOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const categories = useMemo(
    () => [...new Set(permissions.map((item) => item.category))],
    [],
  );

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        getRoleLabel(user.role)
          .toLowerCase()
          .includes(query),
    );
  }, [search, users]);

  function openManage(user: User) {
    setSelectedUser({
      ...user,
      permissions: [...user.permissions],
    });

    setRoleOpen(false);
    setSaved(false);
  }

  function closeManage() {
    setSelectedUser(null);
    setRoleOpen(false);
    setSaved(false);
  }

  function updateRole(role: UserRole) {
    if (!selectedUser) return;

    setSelectedUser({
      ...selectedUser,
      role,
    });

    setSaved(false);
  }

  function togglePermission(permissionId: string) {
    if (!selectedUser) return;

    if (selectedUser.role === "super-admin") return;

    const exists =
      selectedUser.permissions.includes(permissionId);

    setSelectedUser({
      ...selectedUser,
      permissions: exists
        ? selectedUser.permissions.filter(
            (id) => id !== permissionId,
          )
        : [...selectedUser.permissions, permissionId],
    });

    setSaved(false);
  }

  function toggleCategory(category: string) {
    if (!selectedUser) return;

    if (selectedUser.role === "super-admin") return;

    const categoryIds = permissions
      .filter((permission) => permission.category === category)
      .map((permission) => permission.id);

    const hasAll = categoryIds.every((id) =>
      selectedUser.permissions.includes(id),
    );

    setSelectedUser({
      ...selectedUser,
      permissions: hasAll
        ? selectedUser.permissions.filter(
            (id) => !categoryIds.includes(id),
          )
        : [
            ...new Set([
              ...selectedUser.permissions,
              ...categoryIds,
            ]),
          ],
    });

    setSaved(false);
  }

  function toggleAllPermissions() {
    if (!selectedUser) return;

    if (selectedUser.role === "super-admin") return;

    const allSelected =
      selectedUser.permissions.length ===
      allPermissionIds.length;

    setSelectedUser({
      ...selectedUser,
      permissions: allSelected ? [] : [...allPermissionIds],
    });

    setSaved(false);
  }

  function toggleStatus() {
    if (!selectedUser) return;

    setSelectedUser({
      ...selectedUser,
      status:
        selectedUser.status === "Active"
          ? "Blocked"
          : "Active",
    });

    setSaved(false);
  }

  function saveUser() {
    if (!selectedUser) return;

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === selectedUser.id
          ? selectedUser
          : user,
      ),
    );

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Admin Dashboard
        </Link>

        {/* Header */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-5 border-b border-slate-200 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <Users className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-tight">
                  Users
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Manage users, roles, permissions and account
                  status.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-950">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Total Users
                </span>

                <span className="ml-2 font-black">
                  3,842
                </span>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md"
              >
                <UserPlus className="h-4 w-4" />
                Add User
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6">
            <div className="relative max-w-xl">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by name, email or role..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-900"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-slate-50 dark:bg-slate-950">
                <tr>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    User
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Role
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Joined
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="transition hover:bg-slate-50/80 dark:hover:bg-slate-950/50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-black text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                          {user.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {user.name}
                          </p>

                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${getRoleStyle(
                          user.role,
                        )}`}
                      >
                        {user.role === "user" ? (
                          <Users className="h-3 w-3" />
                        ) : (
                          <ShieldCheck className="h-3 w-3" />
                        )}

                        {getRoleLabel(user.role)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                          user.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                            : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                        }`}
                      >
                        {user.status === "Active" ? (
                          <UserCheck className="h-3 w-3" />
                        ) : (
                          <UserX className="h-3 w-3" />
                        )}

                        {user.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {user.joined}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => openManage(user)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-700 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
                      >
                        <UserCog className="h-3.5 w-3.5" />
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                  <Search className="h-5 w-5" />
                </div>

                <h3 className="mt-4 font-bold">
                  No users found
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Try a different name, email or role.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Manage Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            {/* Modal Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <UserCog className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-black">
                    Manage User
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Update role, access and permissions
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeManage}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-5 sm:p-6">
              {/* User */}
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-black text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                  {selectedUser.name
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="font-black">
                    {selectedUser.name}
                  </p>

                  <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              {/* Role */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-bold">
                  Account Role
                </label>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setRoleOpen((current) => !current)
                    }
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-900"
                  >
                    <span>
                      <span className="block text-sm font-bold">
                        {getRoleLabel(selectedUser.role)}
                      </span>

                      <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                        {
                          roleOptions.find(
                            (item) =>
                              item.value ===
                              selectedUser.role,
                          )?.description
                        }
                      </span>
                    </span>

                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform ${
                        roleOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {roleOpen && (
                    <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                      {roleOptions.map((role) => {
                        const active =
                          role.value ===
                          selectedUser.role;

                        return (
                          <button
                            key={role.value}
                            type="button"
                            onClick={() => {
                              updateRole(role.value);
                              setRoleOpen(false);
                            }}
                            className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition ${
                              active
                                ? "bg-indigo-50 dark:bg-indigo-500/10"
                                : "hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                          >
                            <span
                              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                active
                                  ? "bg-indigo-600 text-white"
                                  : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                              }`}
                            >
                              {role.value ===
                              "user" ? (
                                <Users className="h-4 w-4" />
                              ) : (
                                <ShieldCheck className="h-4 w-4" />
                              )}
                            </span>

                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-bold">
                                {role.label}
                              </span>

                              <span className="mt-0.5 block text-xs leading-5 text-slate-500 dark:text-slate-400">
                                {role.description}
                              </span>
                            </span>

                            {active && (
                              <Check className="mt-1 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Permissions */}
              <div className="mt-7">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 className="text-lg font-black">
                      Permissions
                    </h3>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Choose exactly what this account can access.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {selectedUser.permissions.length}/
                      {permissions.length}
                    </span>

                    <button
                      type="button"
                      disabled={
                        selectedUser.role ===
                        "super-admin"
                      }
                      onClick={toggleAllPermissions}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
                    >
                      {selectedUser.permissions
                        .length ===
                      permissions.length
                        ? "Clear All"
                        : "Select All"}
                    </button>
                  </div>
                </div>

                {selectedUser.role === "super-admin" && (
                  <div className="mb-4 rounded-2xl border border-purple-200 bg-purple-50 p-4 dark:border-purple-900/60 dark:bg-purple-500/10">
                    <div className="flex gap-3">
                      <ShieldCheck className="h-5 w-5 shrink-0 text-purple-600 dark:text-purple-400" />

                      <div>
                        <p className="text-sm font-bold text-purple-800 dark:text-purple-300">
                          Full Access Enabled
                        </p>

                        <p className="mt-1 text-xs leading-5 text-purple-700 dark:text-purple-400">
                          Super Admin automatically has every
                          permission. Individual permissions cannot
                          be disabled.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {categories.map((category) => {
                    const categoryPermissions =
                      permissions.filter(
                        (permission) =>
                          permission.category === category,
                      );

                    const enabledCount =
                      categoryPermissions.filter(
                        (permission) =>
                          selectedUser.permissions.includes(
                            permission.id,
                          ),
                      ).length;

                    const allCategorySelected =
                      enabledCount ===
                      categoryPermissions.length;

                    return (
                      <div
                        key={category}
                        className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/50"
                      >
                        {/* Category Header */}
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div>
                            <h4 className="text-sm font-black">
                              {category}
                            </h4>

                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                              {enabledCount} of{" "}
                              {categoryPermissions.length}{" "}
                              enabled
                            </p>
                          </div>

                          <button
                            type="button"
                            disabled={
                              selectedUser.role ===
                              "super-admin"
                            }
                            onClick={() =>
                              toggleCategory(category)
                            }
                            className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              allCategorySelected
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                : "bg-white text-slate-600 hover:text-indigo-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-indigo-400"
                            }`}
                          >
                            {allCategorySelected
                              ? "Clear"
                              : "Enable All"}
                          </button>
                        </div>

                        {/* Checkboxes */}
                        <div className="grid gap-2 md:grid-cols-2">
                          {categoryPermissions.map(
                            (permission) => {
                              const checked =
                                selectedUser.permissions.includes(
                                  permission.id,
                                );

                              return (
                                <button
                                  key={permission.id}
                                  type="button"
                                  disabled={
                                    selectedUser.role ===
                                    "super-admin"
                                  }
                                  onClick={() =>
                                    togglePermission(
                                      permission.id,
                                    )
                                  }
                                  className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                                    checked
                                      ? "border-indigo-200 bg-indigo-50 dark:border-indigo-900/60 dark:bg-indigo-500/10"
                                      : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                                  } disabled:cursor-not-allowed`}
                                >
                                  <span
                                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                                      checked
                                        ? "border-indigo-600 bg-indigo-600 text-white"
                                        : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"
                                    }`}
                                  >
                                    {checked && (
                                      <Check
                                        className="h-3.5 w-3.5"
                                        strokeWidth={3}
                                      />
                                    )}
                                  </span>

                                  <span className="min-w-0">
                                    <span
                                      className={`block text-sm font-bold ${
                                        checked
                                          ? "text-indigo-800 dark:text-indigo-300"
                                          : "text-slate-800 dark:text-slate-200"
                                      }`}
                                    >
                                      {permission.name}
                                    </span>

                                    <span className="mt-0.5 block text-xs leading-5 text-slate-500 dark:text-slate-400">
                                      {
                                        permission.description
                                      }
                                    </span>
                                  </span>
                                </button>
                              );
                            },
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-bold">
                  Account Status
                </label>

                <button
                  type="button"
                  onClick={toggleStatus}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                    selectedUser.status === "Active"
                      ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-500/10"
                      : "border-red-200 bg-red-50 dark:border-red-900/60 dark:bg-red-500/10"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {selectedUser.status === "Active" ? (
                      <UserCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <UserX className="h-5 w-5 text-red-600 dark:text-red-400" />
                    )}

                    <span>
                      <span className="block text-sm font-bold">
                        {selectedUser.status}
                      </span>

                      <span className="block text-xs text-slate-500 dark:text-slate-400">
                        Click to change account status
                      </span>
                    </span>
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      selectedUser.status === "Active"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                        : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
                    }`}
                  >
                    {selectedUser.status === "Active"
                      ? "Enabled"
                      : "Disabled"}
                  </span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/50 sm:flex-row sm:justify-end sm:p-6">
              <button
                type="button"
                onClick={closeManage}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveUser}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                {saved ? (
                  <>
                    <Check className="h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
