"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  BarChart3,
  BookOpen,
  Calendar,
  FileQuestion,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  User,
  UserCheck,
  Users,
  ClipboardList,
  Upload,
  Plus,
  ArrowRight,
} from "lucide-react";

type Stats = {
  users: number;
  exams: number;
  questions: number;
  activeUsers: number;
  mockTests: number;
};

export default function AdminDashboardPage() {
  const { data: session } = useSession();

  const adminName = session?.user?.name || "Administrator";

  const [stats, setStats] = useState<Stats>({
    users: 0,
    exams: 0,
    questions: 0,
    activeUsers: 0,
    mockTests: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch("/api/admin/stats");

        if (!response.ok) return;

        const data = await response.json();

        setStats(data);
      } catch (error) {
        console.error("Failed to load admin stats", error);
      }
    }

    loadStats();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* Header */}
      {/* <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <ShieldCheck size={21} />
            </div>

            <div>
              <p className="font-black">MCQ Admin</p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Administration Panel
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              signOut({
                callbackUrl: "/admin/login",
              })
            }
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header> */}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <nav className="sticky top-20 rounded-3xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
              <AdminNav
                href="/admin/dashboard"
                icon={<LayoutDashboard size={18} />}
                label="Dashboard"
                active
              />
              <AdminNav
                href="/admin/profile"
                icon={<User size={18} />}
                label="Profile"
              />
              <AdminNav
                href="/admin/users"
                icon={<Users size={18} />}
                label="Users"
              />

              <AdminNav
                href="/admin/exams"
                icon={<BookOpen size={18} />}
                label="Exams"
              />

              <AdminNav
                href="/admin/questions"
                icon={<FileQuestion size={18} />}
                label="Questions"
              />

              <AdminNav
                href="/admin/mock-tests"
                icon={<ClipboardList size={18} />}
                label="Mock Tests"
              />
              <AdminNav
                href="/admin/daily-quiz"
                icon={<Calendar size={18} />}
                label="Daily Quiz"
              />

              <AdminNav
                href="/admin/results"
                icon={<BarChart3 size={18} />}
                label="Results"
              />

              <AdminNav
                href="/admin/settings"
                icon={<Settings size={18} />}
                label="Settings"
              />
            </nav>
          </aside>

          {/* Content */}
          <section>
            {/* Welcome */}
            <div className="rounded-3xl bg-slate-900 p-7 text-white shadow-xl sm:p-9">
              <p className="text-sm text-slate-300">
                Administrator
              </p>

              <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                Welcome, {adminName}
              </h1>

              <p className="mt-3 max-w-2xl text-sm text-slate-300">
                Manage users, exams, questions, mock tests and platform
                performance from one place.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/admin/questions/new"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
                >
                  <Plus className="h-4 w-4" />
                  Add Question
                </Link>

                <Link
                  href="/admin/questions/import"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
                >
                  <Upload className="h-4 w-4" />
                  Import Questions
                </Link>
                <Link
                  href="/admin/profile"
                  className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <User size={16} />
                  Profile
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <AdminStat
                icon={<Users size={20} />}
                title="Users"
                value={stats.users}
              />

              <AdminStat
                icon={<BookOpen size={20} />}
                title="Exams"
                value={stats.exams}
              />

              <AdminStat
                icon={<FileQuestion size={20} />}
                title="Questions"
                value={stats.questions}
              />

              <AdminStat
                icon={<UserCheck size={20} />}
                title="Active Users"
                value={stats.activeUsers}
              />
            </div>

            {/* Management */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <AdminPanel
                href="/admin/profile"
                title="Profile"
                description="Manage your profile information and settings."
                icon={<User size={22} />}
              />
              <AdminPanel
                href="/admin/questions"
                title="Question Bank"
                description="Add, edit, delete, search and import MCQ questions."
                icon={<FileQuestion size={22} />}
              />

              <AdminPanel
                href="/admin/exams"
                title="Exam Management"
                description="Create and manage exams and categories."
                icon={<BookOpen size={22} />}
              />

              <AdminPanel
                href="/admin/mock-tests"
                title="Mock Tests"
                description="Create demo and login-required mock tests."
                icon={<ClipboardList size={22} />}
              />
              <AdminPanel
                href="/admin/daily-quiz"
                title="Daily Quiz"
                description="Manage daily quiz questions and schedules."
                icon={<Calendar size={22} />}
              />

              <AdminPanel
                href="/admin/users"
                title="User Management"
                description="Manage registered students and account access."
                icon={<Users size={22} />}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function AdminNav({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
        active
          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function AdminStat({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
          {icon}
        </div>

        <span className="text-2xl font-black">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm font-bold text-slate-500 dark:text-slate-400">
        {title}
      </p>
    </div>
  );
}

function AdminPanel({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-slate-200 bg-white p-6 text-left transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/40"
    >
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
        {icon}
      </div>

      <h2 className="font-black">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>

      <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400">
        Manage
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

// "use client";

// import { signOut, useSession } from "next-auth/react";
// import {
//   BarChart3,
//   BookOpen,
//   FileQuestion,
//   LayoutDashboard,
//   LogOut,
//   Settings,
//   ShieldCheck,
//   UserCheck,
//   Users,
// } from "lucide-react";

// export default function AdminDashboardPage() {
//   const { data: session } = useSession();

//   const adminName = session?.user?.name || "Administrator";

//   return (
//     <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
//       <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
//         <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
//           <div className="flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
//               <ShieldCheck size={21} />
//             </div>

//             <div>
//               <p className="font-black">MCQ Admin</p>
//               <p className="text-xs text-slate-500">
//                 Administration Panel
//               </p>
//             </div>
//           </div>

//           <button
//             onClick={() =>
//               signOut({
//                 callbackUrl: "/admin/login",
//               })
//             }
//             className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
//           >
//             <LogOut size={16} />
//             Logout
//           </button>
//         </div>
//       </header>

//       <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//         <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
//           <aside className="hidden lg:block">
//             <nav className="sticky top-8 rounded-3xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
//               <AdminNav
//                 icon={<LayoutDashboard size={18} />}
//                 label="Dashboard"
//                 active
//               />

//               <AdminNav
//                 icon={<Users size={18} />}
//                 label="Users"
//               />

//               <AdminNav
//                 icon={<BookOpen size={18} />}
//                 label="Exams"
//               />

//               <AdminNav
//                 icon={<FileQuestion size={18} />}
//                 label="Questions"
//               />

//               <AdminNav
//                 icon={<BarChart3 size={18} />}
//                 label="Results"
//               />

//               <AdminNav
//                 icon={<Settings size={18} />}
//                 label="Settings"
//               />
//             </nav>
//           </aside>

//           <section>
//             <div className="rounded-3xl bg-slate-900 p-7 text-white shadow-xl sm:p-9">
//               <p className="text-sm text-slate-300">
//                 Administrator
//               </p>

//               <h1 className="mt-2 text-3xl font-black sm:text-4xl">
//                 Welcome, {adminName}
//               </h1>

//               <p className="mt-3 text-sm text-slate-300">
//                 Manage users, exams, questions and platform
//                 performance from one place.
//               </p>
//             </div>

//             <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
//               <AdminStat
//                 icon={<Users size={20} />}
//                 title="Users"
//                 value="0"
//               />

//               <AdminStat
//                 icon={<BookOpen size={20} />}
//                 title="Exams"
//                 value="0"
//               />

//               <AdminStat
//                 icon={<FileQuestion size={20} />}
//                 title="Questions"
//                 value="0"
//               />

//               <AdminStat
//                 icon={<UserCheck size={20} />}
//                 title="Active"
//                 value="0"
//               />
//             </div>

//             <div className="mt-6 grid gap-6 lg:grid-cols-2">
//               <AdminPanel
//                 title="User Management"
//                 description="Manage registered students and their access."
//                 icon={<Users size={22} />}
//               />

//               <AdminPanel
//                 title="Exam Management"
//                 description="Create and manage exams and categories."
//                 icon={<BookOpen size={22} />}
//               />

//               <AdminPanel
//                 title="Question Bank"
//                 description="Add, edit and organize MCQ questions."
//                 icon={<FileQuestion size={22} />}
//               />

//               <AdminPanel
//                 title="Analytics"
//                 description="Review student performance and results."
//                 icon={<BarChart3 size={22} />}
//               />
//             </div>
//           </section>
//         </div>
//       </div>
//     </main>
//   );
// }

// function AdminNav({
//   icon,
//   label,
//   active = false,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   active?: boolean;
// }) {
//   return (
//     <button
//       className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
//         active
//           ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
//           : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
//       }`}
//     >
//       {icon}
//       {label}
//     </button>
//   );
// }

// function AdminStat({
//   icon,
//   title,
//   value,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   value: string;
// }) {
//   return (
//     <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
//       <div className="flex items-center justify-between">
//         <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
//           {icon}
//         </div>

//         <span className="text-2xl font-black">{value}</span>
//       </div>

//       <p className="mt-4 text-sm font-bold text-slate-500">
//         {title}
//       </p>
//     </div>
//   );
// }

// function AdminPanel({
//   title,
//   description,
//   icon,
// }: {
//   title: string;
//   description: string;
//   icon: React.ReactNode;
// }) {
//   return (
//     <button className="group rounded-3xl border border-slate-200 bg-white p-6 text-left transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
//       <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
//         {icon}
//       </div>

//       <h2 className="font-black">{title}</h2>

//       <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
//         {description}
//       </p>

//       <span className="mt-5 inline-block text-sm font-bold group-hover:underline">
//         Manage →
//       </span>
//     </button>
//   );
// }




// "use client";

// import Link from "next/link";
// import {
//   ArrowRight,
//   BarChart3,
//   BookOpen,
//   CheckCircle2,
//   Clock3,
//   Flame,
//   GraduationCap,
//   Play,
//   Target,
//   Trophy,
//   TrendingUp,
// } from "lucide-react";

// const stats = [
//   {
//     title: "Questions Practiced",
//     value: "128",
//     change: "+18 this week",
//     icon: BookOpen,
//     iconClass:
//       "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
//   },
//   {
//     title: "Average Accuracy",
//     value: "78%",
//     change: "+6% this week",
//     icon: Target,
//     iconClass:
//       "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
//   },
//   {
//     title: "Mock Tests",
//     value: "12",
//     change: "3 completed this week",
//     icon: Trophy,
//     iconClass:
//       "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
//   },
//   {
//     title: "Current Streak",
//     value: "7 days",
//     change: "Keep it going!",
//     icon: Flame,
//     iconClass:
//       "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
//   },
// ];

// const attempts = [
//   {
//     exam: "Computer Instructor",
//     score: 92,
//     correct: 46,
//     total: 50,
//     time: "24 min",
//     date: "Today",
//   },
//   {
//     exam: "Cybersecurity",
//     score: 86,
//     correct: 43,
//     total: 50,
//     time: "27 min",
//     date: "Yesterday",
//   },
//   {
//     exam: "SSC CGL",
//     score: 78,
//     correct: 39,
//     total: 50,
//     time: "29 min",
//     date: "12 Sep",
//   },
// ];

// const recommendedExams = [
//   {
//     name: "Computer Instructor",
//     questions: 250,
//     difficulty: "Medium",
//     slug: "computer-instructor",
//   },
//   {
//     name: "Cybersecurity",
//     questions: 180,
//     difficulty: "Hard",
//     slug: "cybersecurity",
//   },
//   {
//     name: "SSC CGL",
//     questions: 320,
//     difficulty: "Medium",
//     slug: "ssc-cgl",
//   },
// ];

// const weeklyPerformance = [52, 64, 58, 72, 68, 84, 78];
// const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// function getScoreStyle(score: number) {
//   if (score >= 80) {
//     return {
//       badge:
//         "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
//       bar: "bg-emerald-500",
//     };
//   }

//   if (score >= 60) {
//     return {
//       badge:
//         "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
//       bar: "bg-amber-500",
//     };
//   }

//   return {
//     badge:
//       "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20",
//     bar: "bg-rose-500",
//   };
// }

// export default function DashboardPage() {
//   return (
//     <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
//       {/* Header */}
//       <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
//         <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
//           <Link href="/" className="flex items-center gap-3">
//             <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
//               <GraduationCap className="h-5 w-5" />
//             </span>

//             <span className="text-lg font-black tracking-tight">
//               <span className="text-indigo-600 dark:text-indigo-400">MCQ</span>{" "}
//               Practice
//             </span>
//           </Link>

//           <div className="flex items-center gap-3">
//             <Link
//               href="/exams"
//               className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:block dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
//             >
//               Exams
//             </Link>

//             <Link
//               href="/profile"
//               className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 shadow-sm transition hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900"
//             >
//               <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-sm font-black text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
//                 R
//               </span>

//               <span className="hidden text-sm font-bold sm:block">
//                 Radheshyam
//               </span>
//             </Link>
//           </div>
//         </div>
//       </header>

//       <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
//         {/* Welcome */}
//         <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
//           <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
//           <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-violet-500/10 blur-3xl" />

//           <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
//             <div>
//               <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
//                 <TrendingUp className="h-3.5 w-3.5" />
//                 Your learning dashboard
//               </div>

//               <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
//                 Welcome back, Radheshyam
//               </h1>

//               <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
//                 Track your preparation, practice questions, and improve your
//                 exam performance every day.
//               </p>
//             </div>

//             <div className="flex flex-wrap gap-3">
//               <Link
//                 href="/exams"
//                 className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md"
//               >
//                 <Play className="h-4 w-4" />
//                 Start Practice
//               </Link>

//               <Link
//                 href="/mock-tests"
//                 className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
//               >
//                 <Trophy className="h-4 w-4" />
//                 Mock Tests
//               </Link>
//             </div>
//           </div>
//         </section>

//         {/* Stats */}
//         <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//           {stats.map((stat) => {
//             const Icon = stat.icon;

//             return (
//               <div
//                 key={stat.title}
//                 className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
//               >
//                 <div className="flex items-start justify-between gap-4">
//                   <div>
//                     <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
//                       {stat.title}
//                     </p>

//                     <p className="mt-2 text-3xl font-black tracking-tight">
//                       {stat.value}
//                     </p>
//                   </div>

//                   <span
//                     className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconClass}`}
//                   >
//                     <Icon className="h-5 w-5" />
//                   </span>
//                 </div>

//                 <p className="mt-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
//                   {stat.change}
//                 </p>
//               </div>
//             );
//           })}
//         </section>

//         {/* Main grid */}
//         <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
//           {/* Performance */}
//           <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
//             <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
//               <div>
//                 <h2 className="text-xl font-black">Weekly Performance</h2>
//                 <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//                   Your accuracy over the last 7 days.
//                 </p>
//               </div>

//               <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 text-sm font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
//                 <BarChart3 className="h-4 w-4" />
//                 68% average
//               </div>
//             </div>

//             <div className="mt-8 flex h-64 items-end gap-2 sm:gap-4">
//               {weeklyPerformance.map((value, index) => (
//                 <div
//                   key={days[index]}
//                   className="flex h-full flex-1 flex-col items-center justify-end gap-3"
//                 >
//                   <div className="relative flex h-full w-full items-end">
//                     <div
//                       className="group/bar relative w-full rounded-t-xl bg-indigo-500/80 transition hover:bg-indigo-600 dark:bg-indigo-500/70 dark:hover:bg-indigo-500"
//                       style={{ height: `${value}%` }}
//                     >
//                       <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-bold text-white opacity-0 transition group-hover/bar:opacity-100 dark:bg-white dark:text-slate-900">
//                         {value}%
//                       </span>
//                     </div>
//                   </div>

//                   <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
//                     {days[index]}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Quick actions */}
//           <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
//             <div>
//               <h2 className="text-xl font-black">Quick Practice</h2>
//               <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//                 Continue your preparation.
//               </p>
//             </div>

//             <div className="mt-6 space-y-3">
//               <Link
//                 href="/exams"
//                 className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/10"
//               >
//                 <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
//                   <BookOpen className="h-5 w-5" />
//                 </span>

//                 <span className="min-w-0 flex-1">
//                   <span className="block text-sm font-bold">
//                     Practice Questions
//                   </span>
//                   <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
//                     Choose an exam and start
//                   </span>
//                 </span>

//                 <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
//               </Link>

//               <Link
//                 href="/mock-tests"
//                 className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-amber-300 hover:bg-amber-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-amber-500/40 dark:hover:bg-amber-500/10"
//               >
//                 <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
//                   <Trophy className="h-5 w-5" />
//                 </span>

//                 <span className="min-w-0 flex-1">
//                   <span className="block text-sm font-bold">
//                     Take Mock Test
//                   </span>
//                   <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
//                     Test yourself under time limits
//                   </span>
//                 </span>

//                 <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-amber-600 dark:group-hover:text-amber-400" />
//               </Link>

//               <Link
//                 href="/results"
//                 className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-emerald-500/40 dark:hover:bg-emerald-500/10"
//               >
//                 <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
//                   <BarChart3 className="h-5 w-5" />
//                 </span>

//                 <span className="min-w-0 flex-1">
//                   <span className="block text-sm font-bold">
//                     View Results
//                   </span>
//                   <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
//                     Analyze your previous attempts
//                   </span>
//                 </span>

//                 <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
//               </Link>
//             </div>
//           </div>
//         </section>

//         {/* Recent attempts */}
//         <section className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
//           <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-6 sm:flex-row sm:items-center dark:border-slate-800">
//             <div>
//               <h2 className="text-xl font-black">Recent Attempts</h2>
//               <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//                 Review your latest quiz and mock test performance.
//               </p>
//             </div>

//             <Link
//               href="/results"
//               className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
//             >
//               View all
//               <ArrowRight className="h-4 w-4" />
//             </Link>
//           </div>

//           <div className="divide-y divide-slate-200 dark:divide-slate-800">
//             {attempts.map((attempt) => {
//               const style = getScoreStyle(attempt.score);

//               return (
//                 <div
//                   key={`${attempt.exam}-${attempt.date}`}
//                   className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between dark:hover:bg-slate-950"
//                 >
//                   <div className="flex items-center gap-4">
//                     <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
//                       <CheckCircle2 className="h-5 w-5" />
//                     </span>

//                     <div>
//                       <h3 className="font-bold">{attempt.exam}</h3>

//                       <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
//                         <span>
//                           {attempt.correct}/{attempt.total} correct
//                         </span>

//                         <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />

//                         <span className="inline-flex items-center gap-1">
//                           <Clock3 className="h-3.5 w-3.5" />
//                           {attempt.time}
//                         </span>

//                         <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />

//                         <span>{attempt.date}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-4">
//                     <span
//                       className={`rounded-lg px-2.5 py-1.5 text-xs font-black ${style.badge}`}
//                     >
//                       {attempt.score}%
//                     </span>

//                     <Link
//                       href="/results"
//                       className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
//                       aria-label={`View ${attempt.exam} result`}
//                     >
//                       <ArrowRight className="h-4 w-4" />
//                     </Link>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </section>

//         {/* Recommended exams */}
//         <section className="mt-6">
//           <div className="mb-5 flex items-end justify-between gap-4">
//             <div>
//               <h2 className="text-xl font-black">Recommended Exams</h2>
//               <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//                 Exams you can practice next.
//               </p>
//             </div>

//             <Link
//               href="/exams"
//               className="hidden items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 sm:inline-flex dark:text-indigo-400"
//             >
//               Browse all
//               <ArrowRight className="h-4 w-4" />
//             </Link>
//           </div>

//           <div className="grid gap-4 md:grid-cols-3">
//             {recommendedExams.map((exam) => (
//               <Link
//                 key={exam.slug}
//                 href={`/exams/${exam.slug}`}
//                 className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/40"
//               >
//                 <div className="flex items-start justify-between gap-4">
//                   <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
//                     <GraduationCap className="h-5 w-5" />
//                   </span>

//                   <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
//                     {exam.difficulty}
//                   </span>
//                 </div>

//                 <h3 className="mt-5 text-lg font-black">{exam.name}</h3>

//                 <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//                   {exam.questions} practice questions
//                 </p>

//                 <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
//                   <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
//                     Start practicing
//                   </span>

//                   <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-indigo-600 group-hover:text-white dark:bg-slate-800 dark:text-slate-400">
//                     <ArrowRight className="h-4 w-4" />
//                   </span>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </section>

//         {/* Bottom CTA */}
//         <section className="relative mt-6 overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-sm sm:p-8 dark:border dark:border-slate-800">
//           <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />

//           <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
//             <div>
//               <div className="mb-2 flex items-center gap-2 text-indigo-400">
//                 <Flame className="h-5 w-5" />
//                 <span className="text-sm font-bold">7 day streak</span>
//               </div>

//               <h2 className="text-2xl font-black sm:text-3xl">
//                 Keep your preparation going.
//               </h2>

//               <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
//                 Practice a few questions every day and build consistent exam
//                 preparation habits.
//               </p>
//             </div>

//             <Link
//               href="/exams"
//               className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-100"
//             >
//               Continue Practice
//               <ArrowRight className="h-4 w-4" />
//             </Link>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }