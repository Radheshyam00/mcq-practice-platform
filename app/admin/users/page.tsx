"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserCog,
  UserPlus,
  UserX,
  Users,
  X,
} from "lucide-react";

type UserRole =
  | "student"
  | "user"
  | "admin"
  | "super-admin"
  | "question-manager"
  | "exam-manager"
  | "result-manager"
  | "user-manager";

type UserStatus = "active" | "blocked";

type Permission = {
  id: string;
  label: string;
  category: string;
};

type ManagedUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  image?: string;
  permissions: string[];
  createdAt?: string;
  updatedAt?: string;
};

const ROLES: {
  value: UserRole;
  label: string;
}[] = [
  {
    value: "user",
    label: "User",
  },
  {
    value: "student",
    label: "Student",
  },
  {
    value: "admin",
    label: "Admin",
  },
  {
    value: "super-admin",
    label: "Super Admin",
  },
  {
    value: "question-manager",
    label: "Question Manager",
  },
  {
    value: "exam-manager",
    label: "Exam Manager",
  },
  {
    value: "result-manager",
    label: "Result Manager",
  },
  {
    value: "user-manager",
    label: "User Manager",
  },
];

const PERMISSIONS: Permission[] = [
  {
    id: "dashboard.view",
    label: "View Dashboard",
    category: "Dashboard",
  },

  {
    id: "questions.view",
    label: "View Questions",
    category: "Questions",
  },
  {
    id: "questions.create",
    label: "Create Questions",
    category: "Questions",
  },
  {
    id: "questions.edit",
    label: "Edit Questions",
    category: "Questions",
  },
  {
    id: "questions.delete",
    label: "Delete Questions",
    category: "Questions",
  },
  {
    id: "questions.import",
    label: "Import Questions",
    category: "Questions",
  },

  {
    id: "exams.view",
    label: "View Exams",
    category: "Exams",
  },
  {
    id: "exams.create",
    label: "Create Exams",
    category: "Exams",
  },
  {
    id: "exams.edit",
    label: "Edit Exams",
    category: "Exams",
  },
  {
    id: "exams.delete",
    label: "Delete Exams",
    category: "Exams",
  },

  {
    id: "users.view",
    label: "View Users",
    category: "Users",
  },
  {
    id: "users.create",
    label: "Create Users",
    category: "Users",
  },
  {
    id: "users.edit",
    label: "Edit Users",
    category: "Users",
  },
  {
    id: "users.delete",
    label: "Delete Users",
    category: "Users",
  },
  {
    id: "users.block",
    label: "Block / Unblock Users",
    category: "Users",
  },

  {
    id: "mock-tests.view",
    label: "View Mock Tests",
    category: "Mock Tests",
  },
  {
    id: "mock-tests.create",
    label: "Create Mock Tests",
    category: "Mock Tests",
  },
  {
    id: "mock-tests.edit",
    label: "Edit Mock Tests",
    category: "Mock Tests",
  },
  {
    id: "mock-tests.delete",
    label: "Delete Mock Tests",
    category: "Mock Tests",
  },

  {
    id: "results.view",
    label: "View Results",
    category: "Results",
  },
];

const emptyAddForm = {
  name: "",
  email: "",
  password: "",
  role: "user" as UserRole,
  status: "active" as UserStatus,
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ManagedUser[]>([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);

  const [selectedUser, setSelectedUser] =
    useState<ManagedUser | null>(null);

  const [addForm, setAddForm] = useState(emptyAddForm);

  const [addPasswordVisible, setAddPasswordVisible] =
    useState(false);

  const [editPassword, setEditPassword] = useState("");

  const [editPasswordVisible, setEditPasswordVisible] =
    useState(false);

  /**
   * Load users.
   */
  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/users",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load users"
        );
      }

      setUsers(data.users || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  /**
   * Search filtering.
   */
  const filteredUsers = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value) ||
        user.role.toLowerCase().includes(value)
      );
    });
  }, [users, search]);

  /**
   * Add user.
   */
  async function handleAddUser(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!addForm.name.trim()) {
        setError("Name is required");
        return;
      }

      if (!addForm.email.trim()) {
        setError("Email is required");
        return;
      }

      if (addForm.password.length < 6) {
        setError(
          "Password must contain at least 6 characters"
        );
        return;
      }

      const response = await fetch(
        "/api/admin/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: addForm.name,
            email: addForm.email,
            password: addForm.password,
            role: addForm.role,
            status: addForm.status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create user"
        );
      }

      setUsers((current) => [
        data.user,
        ...current,
      ]);

      setAddForm(emptyAddForm);

      setShowAddModal(false);

      setSuccess("User created successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create user"
      );
    } finally {
      setSaving(false);
    }
  }

  /**
   * Open manage modal.
   */
  function openManageUser(user: ManagedUser) {
    setSelectedUser({
      ...user,
      permissions: [...user.permissions],
    });

    setEditPassword("");
    setError("");
    setSuccess("");
  }

  /**
   * Save user changes.
   */
  async function handleSaveUser() {
    if (!selectedUser) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload: Record<string, unknown> = {
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
        status: selectedUser.status,
        permissions: selectedUser.permissions,
      };

      if (editPassword.trim()) {
        payload.password = editPassword;
      }

      const response = await fetch(
        `/api/admin/users/${selectedUser.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update user"
        );
      }

      setUsers((current) =>
        current.map((user) =>
          user.id === selectedUser.id
            ? data.user
            : user
        )
      );

      setSelectedUser(data.user);

      setEditPassword("");

      setSuccess("User updated successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update user"
      );
    } finally {
      setSaving(false);
    }
  }

  /**
   * Delete user.
   */
  async function handleDeleteUser() {
    if (!selectedUser) return;

    const confirmed = window.confirm(
      `Delete ${selectedUser.name}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      const response = await fetch(
        `/api/admin/users/${selectedUser.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete user"
        );
      }

      setUsers((current) =>
        current.filter(
          (user) => user.id !== selectedUser.id
        )
      );

      setSelectedUser(null);

      setSuccess("User deleted successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete user"
      );
    } finally {
      setDeleting(false);
    }
  }

  /**
   * Toggle permission.
   */
  function togglePermission(permissionId: string) {
    if (!selectedUser) return;

    if (selectedUser.role === "super-admin") {
      return;
    }

    const exists =
      selectedUser.permissions.includes(permissionId);

    setSelectedUser({
      ...selectedUser,
      permissions: exists
        ? selectedUser.permissions.filter(
            (permission) =>
              permission !== permissionId
          )
        : [
            ...selectedUser.permissions,
            permissionId,
          ],
    });
  }

  /**
   * Role change.
   */
  function changeRole(role: UserRole) {
    if (!selectedUser) return;

    setSelectedUser({
      ...selectedUser,
      role,
      permissions:
        role === "super-admin"
          ? PERMISSIONS.map(
              (permission) => permission.id
            )
          : selectedUser.permissions,
    });
  }

  /**
   * Group permissions.
   */
  const permissionGroups = useMemo(() => {
    const groups: Record<
      string,
      Permission[]
    > = {};

    for (const permission of PERMISSIONS) {
      if (!groups[permission.category]) {
        groups[permission.category] = [];
      }

      groups[permission.category].push(permission);
    }

    return groups;
  }, []);

  function roleLabel(role: UserRole) {
    return (
      ROLES.find(
        (item) => item.value === role
      )?.label || role
    );
  }

  function formatDate(date?: string) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                <Users className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                  Manage Users
                </h1>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Manage accounts, roles, permissions and
                  status.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowAddModal(true);
              setError("");
              setSuccess("");
              setAddForm(emptyAddForm);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
          >
            <UserPlus className="h-4 w-4" />
            Add User
          </button>
        </div>

        {/* SUCCESS */}
        {success && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
            <Check className="h-4 w-4" />
            {success}
          </div>
        )}

        {/* ERROR */}
        {error && !showAddModal && !selectedUser && (
          <div className="mb-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* STATS */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total Users
              </span>

              <Users className="h-5 w-5 text-indigo-500" />
            </div>

            <p className="text-3xl font-black">
              {users.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Active
              </span>

              <ShieldCheck className="h-5 w-5 text-emerald-500" />
            </div>

            <p className="text-3xl font-black">
              {
                users.filter(
                  (user) => user.status === "active"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Blocked
              </span>

              <UserX className="h-5 w-5 text-red-500" />
            </div>

            <p className="text-3xl font-black">
              {
                users.filter(
                  (user) => user.status === "blocked"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Administrators
              </span>

              <UserCog className="h-5 w-5 text-violet-500" />
            </div>

            <p className="text-3xl font-black">
              {
                users.filter(
                  (user) =>
                    user.role !== "student" &&
                    user.role !== "user"
                ).length
              }
            </p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search users by name, email or role..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading users...
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <Users className="mb-3 h-10 w-10 text-slate-300 dark:text-slate-700" />

              <h3 className="font-bold">
                No users found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {search
                  ? "Try another search."
                  : "Add your first user."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                  <tr>
                    <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                      User
                    </th>

                    <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                      Role
                    </th>

                    <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                      Permissions
                    </th>

                    <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                      Joined
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="transition hover:bg-slate-50 dark:hover:bg-slate-950/60"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-black text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                            {user.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-bold">
                              {user.name}
                            </p>

                            <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {roleLabel(user.role)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold ${
                            user.status === "active"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                              : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              user.status === "active"
                                ? "bg-emerald-500"
                                : "bg-red-500"
                            }`}
                          />

                          {user.status === "active"
                            ? "Active"
                            : "Blocked"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                          {user.role === "super-admin"
                            ? "All"
                            : user.permissions.length}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(user.createdAt)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            openManageUser(user)
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300"
                        >
                          <UserCog className="h-4 w-4" />
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ADD USER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-black">
                  Add User
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create a new platform account.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAddModal(false)
                }
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleAddUser}
              className="space-y-5 p-6"
            >
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Name
                </label>

                <input
                  type="text"
                  value={addForm.name}
                  onChange={(event) =>
                    setAddForm({
                      ...addForm,
                      name: event.target.value,
                    })
                  }
                  placeholder="Enter full name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Email
                </label>

                <input
                  type="email"
                  value={addForm.email}
                  onChange={(event) =>
                    setAddForm({
                      ...addForm,
                      email: event.target.value,
                    })
                  }
                  placeholder="user@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={
                      addPasswordVisible
                        ? "text"
                        : "password"
                    }
                    value={addForm.password}
                    onChange={(event) =>
                      setAddForm({
                        ...addForm,
                        password: event.target.value,
                      })
                    }
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950"
                    required
                    minLength={6}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setAddPasswordVisible(
                        !addPasswordVisible
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {addPasswordVisible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Role
                  </label>

                  <div className="relative">
                    <select
                      value={addForm.role}
                      onChange={(event) =>
                        setAddForm({
                          ...addForm,
                          role: event.target
                            .value as UserRole,
                        })
                      }
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                    >
                      {ROLES.map((role) => (
                        <option
                          key={role.value}
                          value={role.value}
                        >
                          {role.label}
                        </option>
                      ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Status
                  </label>

                  <div className="relative">
                    <select
                      value={addForm.status}
                      onChange={(event) =>
                        setAddForm({
                          ...addForm,
                          status:
                            event.target
                              .value as UserStatus,
                        })
                      }
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                    >
                      <option value="active">
                        Active
                      </option>

                      <option value="blocked">
                        Blocked
                      </option>
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() =>
                    setShowAddModal(false)
                  }
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold dark:border-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}

                  {saving
                    ? "Creating..."
                    : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANAGE USER MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-900">
              <div>
                <h2 className="text-xl font-black">
                  Manage User
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update account information and
                  permissions.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedUser(null)
                }
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                  {success}
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Name
                  </label>

                  <input
                    value={selectedUser.name}
                    onChange={(event) =>
                      setSelectedUser({
                        ...selectedUser,
                        name: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Email
                  </label>

                  <input
                    type="email"
                    value={selectedUser.email}
                    onChange={(event) =>
                      setSelectedUser({
                        ...selectedUser,
                        email: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Role
                  </label>

                  <select
                    value={selectedUser.role}
                    onChange={(event) =>
                      changeRole(
                        event.target.value as UserRole
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                  >
                    {ROLES.map((role) => (
                      <option
                        key={role.value}
                        value={role.value}
                      >
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Status
                  </label>

                  <select
                    value={selectedUser.status}
                    onChange={(event) =>
                      setSelectedUser({
                        ...selectedUser,
                        status:
                          event.target
                            .value as UserStatus,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                  >
                    <option value="active">
                      Active
                    </option>

                    <option value="blocked">
                      Blocked
                    </option>
                  </select>
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="mb-2 block text-sm font-bold">
                  New Password
                </label>

                <div className="relative">
                  <input
                    type={
                      editPasswordVisible
                        ? "text"
                        : "password"
                    }
                    value={editPassword}
                    onChange={(event) =>
                      setEditPassword(
                        event.target.value
                      )
                    }
                    placeholder="Leave blank to keep current password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setEditPasswordVisible(
                        !editPasswordVisible
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {editPasswordVisible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* PERMISSIONS */}
              <div>
                <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="font-black">
                      Permissions
                    </h3>

                    <p className="text-sm text-slate-500">
                      {selectedUser.role ===
                      "super-admin"
                        ? "Super Admin has all permissions."
                        : `${selectedUser.permissions.length} permissions selected`}
                    </p>
                  </div>

                  {selectedUser.role !==
                    "super-admin" && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedUser({
                            ...selectedUser,
                            permissions:
                              PERMISSIONS.map(
                                (permission) =>
                                  permission.id
                              ),
                          })
                        }
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold dark:border-slate-700"
                      >
                        Select All
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedUser({
                            ...selectedUser,
                            permissions: [],
                          })
                        }
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold dark:border-slate-700"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {Object.entries(
                    permissionGroups
                  ).map(
                    ([
                      category,
                      permissions,
                    ]) => (
                      <div
                        key={category}
                        className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
                      >
                        <h4 className="mb-3 text-sm font-black">
                          {category}
                        </h4>

                        <div className="space-y-2">
                          {permissions.map(
                            (permission) => {
                              const checked =
                                selectedUser.role ===
                                "super-admin" ||
                                selectedUser.permissions.includes(
                                  permission.id
                                );

                              return (
                                <label
                                  key={
                                    permission.id
                                  }
                                  className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                  <input
                                    type="checkbox"
                                    checked={
                                      checked
                                    }
                                    disabled={
                                      selectedUser.role ===
                                      "super-admin"
                                    }
                                    onChange={() =>
                                      togglePermission(
                                        permission.id
                                      )
                                    }
                                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                  />

                                  <span className="text-sm font-medium">
                                    {
                                      permission.label
                                    }
                                  </span>
                                </label>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleDeleteUser}
                  disabled={deleting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
                >
                  {deleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}

                  Delete User
                </button>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedUser(null)
                    }
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold dark:border-slate-700"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveUser}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}

                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}