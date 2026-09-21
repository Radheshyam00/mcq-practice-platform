"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Globe,
  Lock,
  Save,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

type SettingsData = {
  websiteName: string;
  websiteDescription: string;

  defaultDuration: number;
  questionsPerQuiz: number;

  showExplanations: boolean;
  allowQuestionNavigation: boolean;

  newUserNotifications: boolean;
  newResultNotifications: boolean;

  requireAdminAuthentication: boolean;
  sessionTimeout: boolean;
};

const DEFAULT_SETTINGS: SettingsData = {
  websiteName: "MCQ Practice",
  websiteDescription:
    "Practice multiple choice questions for competitive exams.",

  defaultDuration: 30,
  questionsPerQuiz: 20,

  showExplanations: true,
  allowQuestionNavigation: true,

  newUserNotifications: true,
  newResultNotifications: false,

  requireAdminAuthentication: true,
  sessionTimeout: true,
};

export default function AdminSettingsPage() {
  const [settings, setSettings] =
    useState<SettingsData>(DEFAULT_SETTINGS);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/settings",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to load settings."
        );
      }

      if (data?.settings) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...data.settings,
        });
      }
    } catch (error) {
      console.error("Load settings error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load settings."
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(
        "/api/admin/settings",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(settings),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to save settings."
        );
      }

      if (data?.settings) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...data.settings,
        });
      }

      setMessage(
        data?.message || "Settings saved successfully."
      );
    } catch (error) {
      console.error("Save settings error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to save settings."
      );
    } finally {
      setSaving(false);
    }
  }

  function updateSetting<K extends keyof SettingsData>(
    key: K,
    value: SettingsData[K]
  ) {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

    setMessage("");
    setError("");
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Admin Dashboard
        </Link>

        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <Settings className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-2xl font-black">
                  Settings
                </h1>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Configure your MCQ platform.
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm font-semibold text-slate-500">
              Loading settings...
            </div>
          ) : (
            <div className="space-y-6 p-5 sm:p-6">
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-400">
                  {error}
                </div>
              )}

              {message && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-400">
                  {message}
                </div>
              )}

              <SettingSection
                icon={<Globe className="h-5 w-5" />}
                title="General Settings"
                description="Basic platform configuration."
              >
                <Field
                  label="Website Name"
                  value={settings.websiteName}
                  onChange={(value) =>
                    updateSetting(
                      "websiteName",
                      value
                    )
                  }
                />

                <Field
                  label="Website Description"
                  value={settings.websiteDescription}
                  onChange={(value) =>
                    updateSetting(
                      "websiteDescription",
                      value
                    )
                  }
                />
              </SettingSection>

              <SettingSection
                icon={
                  <SlidersHorizontal className="h-5 w-5" />
                }
                title="Quiz Settings"
                description="Default quiz behavior."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Default Duration"
                    type="number"
                    value={String(
                      settings.defaultDuration
                    )}
                    onChange={(value) =>
                      updateSetting(
                        "defaultDuration",
                        Number(value)
                      )
                    }
                  />

                  <Field
                    label="Questions Per Quiz"
                    type="number"
                    value={String(
                      settings.questionsPerQuiz
                    )}
                    onChange={(value) =>
                      updateSetting(
                        "questionsPerQuiz",
                        Number(value)
                      )
                    }
                  />
                </div>

                <Toggle
                  title="Show explanations"
                  description="Show explanations after answering questions."
                  checked={
                    settings.showExplanations
                  }
                  onChange={(value) =>
                    updateSetting(
                      "showExplanations",
                      value
                    )
                  }
                />

                <Toggle
                  title="Allow question navigation"
                  description="Allow users to move between questions."
                  checked={
                    settings.allowQuestionNavigation
                  }
                  onChange={(value) =>
                    updateSetting(
                      "allowQuestionNavigation",
                      value
                    )
                  }
                />
              </SettingSection>

              <SettingSection
                icon={<Bell className="h-5 w-5" />}
                title="Notifications"
                description="Manage admin notifications."
              >
                <Toggle
                  title="New user notifications"
                  description="Notify administrators when users register."
                  checked={
                    settings.newUserNotifications
                  }
                  onChange={(value) =>
                    updateSetting(
                      "newUserNotifications",
                      value
                    )
                  }
                />

                <Toggle
                  title="New result notifications"
                  description="Notify administrators about completed tests."
                  checked={
                    settings.newResultNotifications
                  }
                  onChange={(value) =>
                    updateSetting(
                      "newResultNotifications",
                      value
                    )
                  }
                />
              </SettingSection>

              <SettingSection
                icon={<Lock className="h-5 w-5" />}
                title="Security"
                description="Security and administrator controls."
              >
                <Toggle
                  title="Require administrator authentication"
                  description="Protect all administration routes."
                  checked={
                    settings.requireAdminAuthentication
                  }
                  onChange={(value) =>
                    updateSetting(
                      "requireAdminAuthentication",
                      value
                    )
                  }
                />

                <Toggle
                  title="Session timeout"
                  description="Automatically expire inactive admin sessions."
                  checked={settings.sessionTimeout}
                  onChange={(value) =>
                    updateSetting(
                      "sessionTimeout",
                      value
                    )
                  }
                />
              </SettingSection>

              <div className="flex justify-end border-t border-slate-200 pt-5 dark:border-slate-800">
                <button
                  type="button"
                  onClick={saveSettings}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />

                  {saving
                    ? "Saving..."
                    : "Save Settings"}
                </button>
              </div>
            </div>
          )}
        </section>

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />

          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            Admin settings are protected by administrator
            access.
          </p>
        </div>
      </div>
    </main>
  );
}

function SettingSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400">
          {icon}
        </div>

        <div>
          <h2 className="font-black">{title}</h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number";
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-slate-600 dark:text-slate-300">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        min={type === "number" ? 1 : undefined}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      />
    </label>
  );
}

function Toggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-5 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div>
        <p className="text-sm font-bold">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(event.target.checked)
        }
        className="h-5 w-5 shrink-0 accent-indigo-600"
      />
    </label>
  );
}