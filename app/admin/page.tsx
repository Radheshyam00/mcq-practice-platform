
// import Link from "next/link";
// import {
//   Activity,
//   ArrowRight,
//   BarChart3,
//   BookOpen,
//   CheckCircle2,
//   ClipboardCheck,
//   FileQuestion,
//   GraduationCap,
//   ShieldCheck,
//   Users,
// } from "lucide-react";

// const stats = [
//   {
//     title: "Total Questions",
//     value: "1,248",
//     change: "+12.5%",
//     icon: FileQuestion,
//   },
//   {
//     title: "Total Exams",
//     value: "18",
//     change: "+2 this month",
//     icon: GraduationCap,
//   },
//   {
//     title: "Mock Tests",
//     value: "64",
//     change: "+8 this month",
//     icon: ClipboardCheck,
//   },
//   {
//     title: "Registered Users",
//     value: "3,842",
//     change: "+18.2%",
//     icon: Users,
//   },
// ];

// const actions = [
//   {
//     title: "Questions",
//     description: "Manage your MCQ question bank.",
//     href: "/admin/questions",
//     icon: FileQuestion,
//   },
//   {
//     title: "Exams",
//     description: "Manage exams and subjects.",
//     href: "/admin/exams",
//     icon: GraduationCap,
//   },
//   {
//     title: "Mock Tests",
//     description: "Create and manage test sets.",
//     href: "/admin/mock-tests",
//     icon: ClipboardCheck,
//   },
//   {
//     title: "Users",
//     description: "Manage registered users.",
//     href: "/admin/users",
//     icon: Users,
//   },
//   {
//     title: "Results",
//     description: "Review student performance.",
//     href: "/admin/results",
//     icon: BarChart3,
//   },
//   {
//     title: "Settings",
//     description: "Configure platform settings.",
//     href: "/admin/settings",
//     icon: BookOpen,
//   },
//   {
//     title: "Permissions",
//     description: "Create and manage roles and permissions.",
//     href: "/admin/permissions",
//     icon: ShieldCheck,
//   },
// ];

// export default function AdminPage() {
//   return (
//     <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
//       <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//         <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
//           <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

//           <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
//                 <ShieldCheck className="h-3.5 w-3.5" />
//                 Administrator
//               </div>

//               <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
//                 Admin Dashboard
//               </h1>

//               <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
//                 Manage questions, exams, mock tests, users and results from
//                 one place.
//               </p>
//             </div>

//             <Link
//               href="/"
//               className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
//             >
//               View Website
//               <ArrowRight className="h-4 w-4" />
//             </Link>
//           </div>
//         </section>

//         <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           {stats.map((stat) => {
//             const Icon = stat.icon;

//             return (
//               <div
//                 key={stat.title}
//                 className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
//               >
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <p className="text-sm text-slate-500 dark:text-slate-400">
//                       {stat.title}
//                     </p>

//                     <p className="mt-2 text-3xl font-black">{stat.value}</p>

//                     <p className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
//                       {stat.change}
//                     </p>
//                   </div>

//                   <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
//                     <Icon className="h-5 w-5" />
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </section>

//         <section className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
//           <div className="border-b border-slate-200 p-5 dark:border-slate-800">
//             <h2 className="text-lg font-black">Quick Management</h2>
//             <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//               Manage the main sections of your MCQ platform.
//             </p>
//           </div>

//           <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
//             {actions.map((action) => {
//               const Icon = action.icon;

//               return (
//                 <Link
//                   key={action.title}
//                   href={action.href}
//                   className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:hover:border-indigo-500/50"
//                 >
//                   <div className="flex items-start justify-between">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
//                       <Icon className="h-5 w-5" />
//                     </div>

//                     <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-500" />
//                   </div>

//                   <h3 className="mt-4 font-bold">{action.title}</h3>

//                   <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
//                     {action.description}
//                   </p>
//                 </Link>
//               );
//             })}
//           </div>
//         </section>

//         <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
//           <div className="flex items-center gap-3">
//             <Activity className="h-5 w-5 text-indigo-500" />

//             <div>
//               <h2 className="font-black">System Status</h2>
//               <p className="text-xs text-slate-500 dark:text-slate-400">
//                 Current administration system status.
//               </p>
//             </div>
//           </div>

//           <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
//             <CheckCircle2 className="h-5 w-5 text-emerald-500" />

//             <div>
//               <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
//                 All systems operational
//               </p>

//               <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70">
//                 Admin dashboard is ready.
//               </p>
//             </div>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }

