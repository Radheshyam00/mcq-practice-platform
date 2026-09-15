
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  BookOpen,
  Check,
  ChevronRight,
  Eye,
  GraduationCap,
  Lock,
  LogOut,
  Moon,
  Save,
  Shield,
  Sun,
  User,
} from "lucide-react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [resultNotifications, setResultNotifications] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [showProgress, setShowProgress] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>

          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </span>

            <span className="hidden text-lg font-black sm:block">
              <span className="text-indigo-600 dark:text-indigo-400">MCQ</span>{" "}
              Practice
            </span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Heading */}
        <div className="mb-6">
          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
            Account
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight">
            Settings
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Customize your MCQ Practice experience and account preferences.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          {/* Sidebar */}
          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <SettingNav
              icon={<User className="h-4 w-4" />}
              label="Account"
              active
            />

            <SettingNav
              icon={<Bell className="h-4 w-4" />}
              label="Notifications"
            />

            <SettingNav
              icon={<Eye className="h-4 w-4" />}
              label="Appearance"
            />

            <SettingNav
              icon={<Shield className="h-4 w-4" />}
              label="Security"
            />
          </aside>

          {/* Settings content */}
          <div className="space-y-6">
            {/* Account */}
            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    <User className="h-5 w-5" />
                  </span>

                  <div>
                    <h2 className="font-black">Account Settings</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Manage your basic account information.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 p-6 sm:grid-cols-2">
                <InputField
                  label="Full Name"
                  value="Radheshyam"
                  placeholder="Enter your name"
                />

                <InputField
                  label="Email Address"
                  value="user@example.com"
                  placeholder="Enter your email"
                  type="email"
                />
              </div>
            </section>

            {/* Notifications */}
            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                    <Bell className="h-5 w-5" />
                  </span>

                  <div>
                    <h2 className="font-black">Notifications</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Choose what notifications you receive.
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                <ToggleRow
                  title="Email Notifications"
                  description="Receive important account and platform updates."
                  enabled={emailNotifications}
                  onChange={() =>
                    setEmailNotifications(!emailNotifications)
                  }
                />

                <ToggleRow
                  title="Quiz Results"
                  description="Get notified when your quiz results are available."
                  enabled={resultNotifications}
                  onChange={() =>
                    setResultNotifications(!resultNotifications)
                  }
                />

                <ToggleRow
                  title="Daily Practice Reminder"
                  description="Receive a reminder to maintain your practice streak."
                  enabled={dailyReminder}
                  onChange={() => setDailyReminder(!dailyReminder)}
                />
              </div>
            </section>

            {/* Appearance */}
            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                    {darkMode ? (
                      <Moon className="h-5 w-5" />
                    ) : (
                      <Sun className="h-5 w-5" />
                    )}
                  </span>

                  <div>
                    <h2 className="font-black">Appearance</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Customize how the website looks.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <ToggleRow
                  title="Dark Mode"
                  description="Use a darker interface that is easier on the eyes."
                  enabled={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />

                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-sm font-bold">Theme Preview</p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <ThemeCard
                      icon={<Sun className="h-4 w-4" />}
                      title="Light"
                      active={!darkMode}
                      onClick={() => setDarkMode(false)}
                    />

                    <ThemeCard
                      icon={<Moon className="h-4 w-4" />}
                      title="Dark"
                      active={darkMode}
                      onClick={() => setDarkMode(true)}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Privacy */}
            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <Eye className="h-5 w-5" />
                  </span>

                  <div>
                    <h2 className="font-black">Privacy</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Control how your learning information is displayed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <ToggleRow
                  title="Show Learning Progress"
                  description="Allow your progress statistics to appear on your profile."
                  enabled={showProgress}
                  onChange={() => setShowProgress(!showProgress)}
                />
              </div>
            </section>

            {/* Security */}
            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                    <Lock className="h-5 w-5" />
                  </span>

                  <div>
                    <h2 className="font-black">Security</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Protect your account.
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                <ActionRow
                  title="Change Password"
                  description="Update your account password."
                />

                <ActionRow
                  title="Two-Factor Authentication"
                  description="Add an extra layer of account security."
                  badge="Coming Soon"
                />

                <button
                  type="button"
                  className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-rose-50 dark:hover:bg-rose-950/20"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                    <LogOut className="h-4 w-4" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-rose-700 dark:text-rose-400">
                      Sign Out
                    </span>

                    <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                      Sign out from your current account.
                    </span>
                  </span>

                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              </div>
            </section>

            {/* Save */}
            <div className="sticky bottom-4 z-20 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 text-sm">
                  {saved ? (
                    <>
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                        <Check className="h-4 w-4" />
                      </span>

                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                        Settings saved successfully.
                      </span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-500 dark:text-slate-400">
                        Save your changes before leaving.
                      </span>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function SettingNav({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition ${
        active
          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function InputField({
  label,
  value,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-slate-600 dark:text-slate-300">
        {label}
      </span>

      <input
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
      />
    </label>
  );
}

function ToggleRow({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center gap-4 p-5">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold">{title}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onChange}
        aria-pressed={enabled}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          enabled
            ? "bg-indigo-600"
            : "bg-slate-300 dark:bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function ThemeCard({
  icon,
  title,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
        active
          ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-500/50 dark:bg-indigo-500/10 dark:text-indigo-400"
          : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500/40"
      }`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
        {icon}
      </span>

      <span className="flex-1 text-sm font-bold">{title}</span>

      {active && <Check className="h-4 w-4" />}
    </button>
  );
}

function ActionRow({
  title,
  description,
  badge,
}: {
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-950"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold">{title}</span>

        <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
          {description}
        </span>
      </span>

      {badge && (
        <span className="hidden rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500 sm:block dark:bg-slate-800 dark:text-slate-400">
          {badge}
        </span>
      )}

      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
    </button>
  );
}

