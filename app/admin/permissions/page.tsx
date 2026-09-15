
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Lock,
  Save,
  Shield,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

type Role = {
  id: string;
  name: string;
  description: string;
  color: string;
};

type Permission = {
  id: string;
  name: string;
  description: string;
  category: string;
};

const roles: Role[] = [
  {
    id: "super-admin",
    name: "Super Admin",
    description: "Full access to the entire administration portal.",
    color: "indigo",
  },
  {
    id: "admin",
    name: "Admin",
    description: "Manage exams, questions, users and results.",
    color: "blue",
  },
  {
    id: "question-manager",
    name: "Question Manager",
    description: "Create and manage question banks.",
    color: "emerald",
  },
  {
    id: "exam-manager",
    name: "Exam Manager",
    description: "Manage exams and mock test series.",
    color: "violet",
  },
  {
    id: "result-manager",
    name: "Result Manager",
    description: "View and manage student results.",
    color: "amber",
  },
  {
    id: "user-manager",
    name: "User Manager",
    description: "Manage registered users and accounts.",
    color: "rose",
  },
];

const permissions: Permission[] = [
  {
    id: "dashboard.view",
    name: "View Dashboard",
    description: "Access the admin dashboard and statistics.",
    category: "Dashboard",
  },
  {
    id: "users.view",
    name: "View Users",
    description: "View registered users and their profiles.",
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
    description: "Update user information and account details.",
    category: "Users",
  },
  {
    id: "users.delete",
    name: "Delete Users",
    description: "Remove user accounts from the platform.",
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
    description: "Add new questions to the question bank.",
    category: "Questions",
  },
  {
    id: "questions.edit",
    name: "Edit Questions",
    description: "Modify existing questions and answers.",
    category: "Questions",
  },
  {
    id: "questions.delete",
    name: "Delete Questions",
    description: "Delete questions from the question bank.",
    category: "Questions",
  },
  {
    id: "exams.view",
    name: "View Exams",
    description: "View available exams and subjects.",
    category: "Exams",
  },
  {
    id: "exams.create",
    name: "Create Exams",
    description: "Create new exams and subjects.",
    category: "Exams",
  },
  {
    id: "exams.edit",
    name: "Edit Exams",
    description: "Update exam information and subjects.",
    category: "Exams",
  },
  {
    id: "exams.delete",
    name: "Delete Exams",
    description: "Remove exams from the platform.",
    category: "Exams",
  },
  {
    id: "mock-tests.view",
    name: "View Mock Tests",
    description: "View available mock test series.",
    category: "Mock Tests",
  },
  {
    id: "mock-tests.create",
    name: "Create Mock Tests",
    description: "Create new mock tests.",
    category: "Mock Tests",
  },
  {
    id: "mock-tests.edit",
    name: "Edit Mock Tests",
    description: "Modify existing mock tests.",
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
    description: "View student exam results.",
    category: "Results",
  },
  {
    id: "results.delete",
    name: "Delete Results",
    description: "Delete stored exam results.",
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
    description: "Change platform and quiz settings.",
    category: "Settings",
  },
  {
    id: "permissions.view",
    name: "View Permissions",
    description: "View admin roles and permissions.",
    category: "Permissions",
  },
  {
    id: "permissions.edit",
    name: "Edit Permissions",
    description: "Change permissions assigned to roles.",
    category: "Permissions",
  },
];

const rolePermissions: Record<string, string[]> = {
  "super-admin": permissions.map((permission) => permission.id),

  admin: [
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

  "question-manager": [
    "dashboard.view",
    "questions.view",
    "questions.create",
    "questions.edit",
    "questions.delete",
  ],

  "exam-manager": [
    "dashboard.view",
    "exams.view",
    "exams.create",
    "exams.edit",
    "exams.delete",
    "mock-tests.view",
    "mock-tests.create",
    "mock-tests.edit",
    "mock-tests.delete",
  ],

  "result-manager": [
    "dashboard.view",
    "results.view",
  ],

  "user-manager": [
    "dashboard.view",
    "users.view",
    "users.create",
    "users.edit",
    "users.delete",
  ],
};

export default function AdminPermissionsPage() {
  const [selectedRole, setSelectedRole] = useState("admin");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    rolePermissions.admin,
  );
  const [saved, setSaved] = useState(false);

  const selectedRoleData = roles.find((role) => role.id === selectedRole);

  const categories = useMemo(() => {
    return [...new Set(permissions.map((permission) => permission.category))];
  }, []);

  const allSelected =
    selectedPermissions.length === permissions.length;

  function selectRole(roleId: string) {
    setSelectedRole(roleId);
    setSelectedPermissions(rolePermissions[roleId] ?? []);
    setSaved(false);
  }

  function togglePermission(permissionId: string) {
    if (selectedRole === "super-admin") return;

    setSelectedPermissions((current) =>
      current.includes(permissionId)
        ? current.filter((id) => id !== permissionId)
        : [...current, permissionId],
    );

    setSaved(false);
  }

  function toggleCategory(category: string) {
    if (selectedRole === "super-admin") return;

    const categoryPermissions = permissions
      .filter((permission) => permission.category === category)
      .map((permission) => permission.id);

    const hasAll = categoryPermissions.every((id) =>
      selectedPermissions.includes(id),
    );

    setSelectedPermissions((current) =>
      hasAll
        ? current.filter((id) => !categoryPermissions.includes(id))
        : [...new Set([...current, ...categoryPermissions])],
    );

    setSaved(false);
  }

  function toggleAll() {
    if (selectedRole === "super-admin") return;

    setSelectedPermissions(
      allSelected ? [] : permissions.map((permission) => permission.id),
    );

    setSaved(false);
  }

  function savePermissions() {
    // Connect this to your database/API later.
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="mb-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-500/10 dark:text-indigo-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Access Control
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Admin Permissions
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Control which areas of the administration portal each role can
                access.
              </p>
            </div>

            <button
              type="button"
              onClick={savePermissions}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
            >
              {saved ? (
                <>
                  <Check className="h-4 w-4" />
                  Permissions Saved
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Permissions
                </>
              )}
            </button>
          </div>
        </div>

        {/* Warning */}
        {selectedRole === "super-admin" && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/60 dark:bg-amber-950/30">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
              <Lock className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                Super Admin has full access
              </p>
              <p className="mt-1 text-xs leading-5 text-amber-700 dark:text-amber-400">
                Super Admin permissions cannot be disabled from this screen.
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          {/* Roles */}
          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between px-2">
              <div>
                <h2 className="font-black">Admin Roles</h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Select a role to manage
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <Users className="h-4 w-4" />
              </div>
            </div>

            <div className="space-y-2">
              {roles.map((role) => {
                const active = selectedRole === role.id;

                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => selectRole(role.id)}
                    className={`w-full rounded-2xl border p-3 text-left transition ${
                      active
                        ? "border-indigo-300 bg-indigo-50 shadow-sm dark:border-indigo-800 dark:bg-indigo-500/10"
                        : "border-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-800 dark:hover:bg-slate-950"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          active
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {role.id === "super-admin" ? (
                          <ShieldCheck className="h-5 w-5" />
                        ) : (
                          <Shield className="h-5 w-5" />
                        )}
                      </span>

                      <span className="min-w-0">
                        <span
                          className={`block text-sm font-bold ${
                            active
                              ? "text-indigo-700 dark:text-indigo-300"
                              : "text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          {role.name}
                        </span>

                        <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">
                          {role.description}
                        </span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Permissions */}
          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {/* Permission header */}
            <div className="border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black">
                      {selectedRoleData?.name}
                    </h2>

                    {selectedRole === "super-admin" && (
                      <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                        Full Access
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {selectedRoleData?.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {selectedPermissions.length}/{permissions.length} enabled
                  </span>

                  <button
                    type="button"
                    onClick={toggleAll}
                    disabled={selectedRole === "super-admin"}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
                  >
                    {allSelected ? "Clear All" : "Select All"}
                  </button>
                </div>
              </div>
            </div>

            {/* Permission groups */}
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {categories.map((category) => {
                const categoryPermissions = permissions.filter(
                  (permission) => permission.category === category,
                );

                const enabledCount = categoryPermissions.filter((permission) =>
                  selectedPermissions.includes(permission.id),
                ).length;

                const categoryComplete =
                  enabledCount === categoryPermissions.length;

                return (
                  <div key={category} className="p-5 sm:p-6">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-black">{category}</h3>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {enabledCount} of {categoryPermissions.length}{" "}
                          permissions enabled
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleCategory(category)}
                        disabled={selectedRole === "super-admin"}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                          categoryComplete
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        {categoryComplete ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            All Enabled
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3.5 w-3.5" />
                            Enable All
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      {categoryPermissions.map((permission) => {
                        const enabled = selectedPermissions.includes(
                          permission.id,
                        );

                        return (
                          <button
                            key={permission.id}
                            type="button"
                            onClick={() => togglePermission(permission.id)}
                            disabled={selectedRole === "super-admin"}
                            className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                              enabled
                                ? "border-indigo-200 bg-indigo-50/70 dark:border-indigo-900/70 dark:bg-indigo-500/5"
                                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-950"
                            } disabled:cursor-not-allowed`}
                          >
                            <span
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                                enabled
                                  ? "border-indigo-600 bg-indigo-600 text-white"
                                  : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"
                              }`}
                            >
                              {enabled && (
                                <Check
                                  className="h-3.5 w-3.5"
                                  strokeWidth={3}
                                />
                              )}
                            </span>

                            <span className="min-w-0">
                              <span
                                className={`block text-sm font-bold ${
                                  enabled
                                    ? "text-indigo-800 dark:text-indigo-300"
                                    : "text-slate-800 dark:text-slate-200"
                                }`}
                              >
                                {permission.name}
                              </span>

                              <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">
                                {permission.description}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/50 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Lock className="h-4 w-4" />
                Permission changes should be reviewed before saving.
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => selectRole(selectedRole)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <X className="h-4 w-4" />
                  Reset
                </button>

                <button
                  type="button"
                  onClick={savePermissions}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
