
"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  Shield,
  User,
  Users,
} from "lucide-react";

export type UserRole =
  | "user"
  | "admin"
  | "super-admin"
  | "question-manager"
  | "exam-manager"
  | "result-manager"
  | "user-manager";

type RoleSelectorProps = {
  value: UserRole;
  onChange: (role: UserRole) => void;
  disabled?: boolean;
};

const roles: {
  value: UserRole;
  label: string;
  description: string;
  icon: typeof User;
}[] = [
  {
    value: "user",
    label: "User",
    description: "Can practice exams and view personal results.",
    icon: User,
  },
  {
    value: "admin",
    label: "Admin",
    description: "Can manage users, exams, questions and results.",
    icon: Shield,
  },
  {
    value: "super-admin",
    label: "Super Admin",
    description: "Full access to the administration portal.",
    icon: Shield,
  },
  {
    value: "question-manager",
    label: "Question Manager",
    description: "Can create, edit and delete questions.",
    icon: Users,
  },
  {
    value: "exam-manager",
    label: "Exam Manager",
    description: "Can manage exams and mock tests.",
    icon: Users,
  },
  {
    value: "result-manager",
    label: "Result Manager",
    description: "Can view and manage student results.",
    icon: Users,
  },
  {
    value: "user-manager",
    label: "User Manager",
    description: "Can manage registered users.",
    icon: Users,
  },
];

export function RoleSelector({
  value,
  onChange,
  disabled = false,
}: RoleSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedRole =
    roles.find((role) => role.value === value) ?? roles[0];

  const Icon = selectedRole.icon;

  return (
    <div className="relative w-full">
      <label
        htmlFor="role-selector"
        className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200"
      >
        Account Role
      </label>

      <button
        id="role-selector"
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3 text-left shadow-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-slate-900 dark:focus:ring-offset-slate-950 ${
          open
            ? "border-indigo-400 dark:border-indigo-500"
            : "border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <Icon className="h-4 w-4" />
          </span>

          <span className="min-w-0">
            <span className="block text-sm font-bold text-slate-900 dark:text-white">
              {selectedRole.label}
            </span>

            <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">
              {selectedRole.description}
            </span>
          </span>
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && !disabled && (
        <>
          <button
            type="button"
            aria-label="Close role selector"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />

          <div
            role="listbox"
            aria-label="Account roles"
            className="absolute left-0 right-0 z-50 mt-2 max-h-80 overflow-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900"
          >
            {roles.map((role) => {
              const RoleIcon = role.icon;
              const selected = role.value === value;

              return (
                <button
                  key={role.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(role.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition ${
                    selected
                      ? "bg-indigo-50 dark:bg-indigo-500/10"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      selected
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    <RoleIcon className="h-4 w-4" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-sm font-bold ${
                        selected
                          ? "text-indigo-700 dark:text-indigo-300"
                          : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {role.label}
                    </span>

                    <span className="mt-0.5 block text-xs leading-5 text-slate-500 dark:text-slate-400">
                      {role.description}
                    </span>
                  </span>

                  {selected && (
                    <Check className="mt-1 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

