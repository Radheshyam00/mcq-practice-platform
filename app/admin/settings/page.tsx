
import Link from "next/link";
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

export default function AdminSettingsPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/admin"
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
                <h1 className="text-2xl font-black">Settings</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Configure your MCQ platform.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-6">
            <SettingSection
              icon={<Globe className="h-5 w-5" />}
              title="General Settings"
              description="Basic platform configuration."
            >
              <Field label="Website Name" defaultValue="MCQ Practice" />

              <Field
                label="Website Description"
                defaultValue="Practice multiple choice questions for competitive exams."
              />
            </SettingSection>

            <SettingSection
              icon={<SlidersHorizontal className="h-5 w-5" />}
              title="Quiz Settings"
              description="Default quiz behavior."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Default Duration" defaultValue="30" />

                <Field label="Questions Per Quiz" defaultValue="20" />
              </div>

              <Toggle
                title="Show explanations"
                description="Show explanations after answering questions."
                defaultChecked
              />

              <Toggle
                title="Allow question navigation"
                description="Allow users to move between questions."
                defaultChecked
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
                defaultChecked
              />

              <Toggle
                title="New result notifications"
                description="Notify administrators about completed tests."
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
                defaultChecked
              />

              <Toggle
                title="Session timeout"
                description="Automatically expire inactive admin sessions."
                defaultChecked
              />
            </SettingSection>

            <div className="flex justify-end border-t border-slate-200 pt-5 dark:border-slate-800">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-700"
              >
                <Save className="h-4 w-4" />
                Save Settings
              </button>
            </div>
          </div>
        </section>

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />

          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            Admin settings are protected by administrator access.
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

      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  defaultValue,
}: {
  label: string;
  defaultValue: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-slate-600 dark:text-slate-300">
        {label}
      </span>

      <input
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      />
    </label>
  );
}

function Toggle({
  title,
  description,
  defaultChecked = false,
}: {
  title: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-5 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-5 w-5 shrink-0 accent-indigo-600"
      />
    </label>
  );
}

