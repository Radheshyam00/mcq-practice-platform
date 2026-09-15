
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FileQuestion,
  GraduationCap,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

const stats = [
  {
    title: "Total Questions",
    value: "1,248",
    change: "+12.5%",
    icon: FileQuestion,
    iconClass:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
  },
  {
    title: "Total Exams",
    value: "18",
    change: "+2 this month",
    icon: GraduationCap,
    iconClass:
      "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  },
  {
    title: "Mock Tests",
    value: "64",
    change: "+8 this month",
    icon: ClipboardCheck,
    iconClass:
      "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
  },
  {
    title: "Registered Users",
    value: "3,842",
    change: "+18.2%",
    icon: Users,
    iconClass:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
];

const quickActions = [
  {
    title: "Manage Questions",
    description: "Add, edit, delete and organize MCQs.",
    href: "/admin/questions",
    icon: FileQuestion,
  },
  {
    title: "Manage Exams",
    description: "Create exams and configure subjects.",
    href: "/admin/exams",
    icon: GraduationCap,
  },
  {
    title: "Mock Tests",
    description: "Create and manage mock test sets.",
    href: "/admin/mock-tests",
    icon: ClipboardCheck,
  },
  {
    title: "Users",
    description: "View registered users and activity.",
    href: "/admin/users",
    icon: Users,
  },
];

const recentActivity = [
  {
    title: "New questions added",
    description: "25 questions were added to Computer Science.",
    time: "10 min ago",
    icon: FileQuestion,
  },
  {
    title: "Mock test created",
    description: "SSC CGL Mock Test 05 was created.",
    time: "42 min ago",
    icon: ClipboardCheck,
  },
  {
    title: "New user registered",
    description: "12 new users joined the platform.",
    time: "2 hours ago",
    icon: Users,
  },
  {
    title: "Exam updated",
    description: "UPSC subjects were updated.",
    time: "5 hours ago",
    icon: GraduationCap,
  },
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl"
          />

          <div className="relative flex flex-col gap-6 px-5 py-7 sm:px-8 sm:py-9 lg:flex-row lg:items-center lg:justify-between lg:px-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Administrator
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Admin Dashboard
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                Manage your exams, questions, mock tests, users and platform
                activity from one place.
              </p>
            </div>

            <Link
              href="/"
              className="
                inline-flex w-fit items-center gap-2 rounded-xl
                border border-slate-200 bg-white px-4 py-2.5
                text-sm font-bold text-slate-700 shadow-sm
                transition-all duration-200
                hover:-translate-y-0.5 hover:border-slate-300
                hover:bg-slate-50 hover:text-slate-900 hover:shadow-md
                dark:border-slate-700 dark:bg-slate-800
                dark:text-slate-200 dark:hover:border-slate-600
                dark:hover:bg-slate-700 dark:hover:text-white
              "
            >
              <LayoutDashboard className="h-4 w-4" />
              View Website
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="
                  group rounded-2xl border border-slate-200
                  bg-white p-5 shadow-sm
                  transition-all duration-200
                  hover:-translate-y-0.5 hover:shadow-md
                  dark:border-slate-800 dark:bg-slate-900
                "
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {stat.title}
                    </p>

                    <p className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                      {stat.value}
                    </p>

                    <p className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {stat.change}
                    </p>
                  </div>

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Main grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Quick actions */}
          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <Settings className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-black text-slate-900 dark:text-white">
                    Quick Management
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Manage the core platform content.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="
                      group rounded-2xl border border-slate-200
                      bg-white p-4 shadow-sm
                      transition-all duration-200
                      hover:-translate-y-0.5 hover:border-indigo-300
                      hover:bg-indigo-50/40 hover:shadow-md
                      dark:border-slate-800 dark:bg-slate-950
                      dark:hover:border-indigo-500/50
                      dark:hover:bg-indigo-950/20
                    "
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="
                          flex h-10 w-10 shrink-0 items-center
                          justify-center rounded-xl
                          bg-slate-100 text-slate-600
                          transition-colors
                          group-hover:bg-indigo-100 group-hover:text-indigo-600
                          dark:bg-slate-800 dark:text-slate-300
                          dark:group-hover:bg-indigo-500/10
                          dark:group-hover:text-indigo-400
                        "
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            {action.title}
                          </h3>

                          <ArrowRight
                            className="
                              h-4 w-4 shrink-0 text-slate-400
                              transition-transform duration-200
                              group-hover:translate-x-0.5
                              group-hover:text-indigo-500
                            "
                          />
                        </div>

                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Platform overview */}
          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                  <BarChart3 className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-black text-slate-900 dark:text-white">
                    Platform Overview
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Current content distribution.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-5">
              <ProgressItem
                title="Questions"
                value="1,248"
                percentage={78}
                icon={<FileQuestion className="h-4 w-4" />}
              />

              <ProgressItem
                title="Mock Tests"
                value="64"
                percentage={52}
                icon={<ClipboardCheck className="h-4 w-4" />}
              />

              <ProgressItem
                title="Exams"
                value="18"
                percentage={35}
                icon={<BookOpen className="h-4 w-4" />}
              />

              <ProgressItem
                title="Users"
                value="3,842"
                percentage={88}
                icon={<Users className="h-4 w-4" />}
              />
            </div>
          </section>
        </div>

        {/* Recent activity */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <Activity className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-black text-slate-900 dark:text-white">
                  Recent Activity
                </h2>

                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Latest changes across the platform.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="
                inline-flex w-fit items-center gap-2 rounded-xl
                border border-slate-200 bg-white px-3 py-2
                text-xs font-bold text-slate-600 shadow-sm
                transition-colors hover:bg-slate-50
                dark:border-slate-700 dark:bg-slate-800
                dark:text-slate-300 dark:hover:bg-slate-700
              "
            >
              View Activity
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;

              return (
                <div
                  key={activity.title}
                  className="
                    flex items-start gap-4 px-5 py-4
                    transition-colors hover:bg-slate-50
                    dark:hover:bg-slate-950/50
                    sm:px-6
                  "
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {activity.title}
                      </h3>

                      <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                        {activity.time}
                      </span>
                    </div>

                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      {activity.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer status */}
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </span>

            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Admin panel is operational
            </span>
          </div>

          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            MCQ Practice Administration
          </span>
        </div>
      </div>
    </main>
  );
}

function ProgressItem({
  title,
  value,
  percentage,
  icon,
}: {
  title: string;
  value: string;
  percentage: number;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 dark:text-slate-500">
            {icon}
          </span>

          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            {title}
          </span>
        </div>

        <span className="text-xs font-bold text-slate-900 dark:text-white">
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-500 dark:bg-indigo-500"
          style={{
            width: `${Math.min(Math.max(percentage, 0), 100)}%`,
          }}
        />
      </div>
    </div>
  );
}

