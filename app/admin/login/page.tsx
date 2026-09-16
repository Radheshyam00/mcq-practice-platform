"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      adminLogin: "true",
      redirect: false,
      callbackUrl: "/admin/dashboard",
    });

    if (!result || result.error) {
      setError(
        "Invalid admin credentials or you do not have admin access."
      );
      setLoading(false);
      return;
    }

    window.location.href =
      result.url || "/admin/dashboard";
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto flex min-h-[85vh] max-w-md items-center justify-center">
        <div className="w-full">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xl dark:bg-white dark:text-slate-900">
              <ShieldCheck size={30} />
            </div>

            <h1 className="text-3xl font-black">
              Admin Portal
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Authorized administrators only.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-bold">
                  Admin Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="admin@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Admin password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-white"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 font-bold text-white transition hover:bg-slate-700 disabled:opacity-60 dark:bg-white dark:text-slate-900"
              >
                {loading ? "Authenticating..." : "Admin Login"}

                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
              <KeyRound size={14} />
              Secure administrator authentication
            </div>

            <div className="mt-5 text-center">
              <Link
                href="/login"
                className="text-sm font-bold text-slate-600 hover:underline dark:text-slate-300"
              >
                ← Back to Student Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


// "use client";

// import Link from "next/link";
// import { FormEvent, useState } from "react";
// import {
//   ArrowRight,
//   Eye,
//   EyeOff,
//   KeyRound,
//   LockKeyhole,
//   Mail,
//   ShieldCheck,
// } from "lucide-react";

// export default function AdminLoginPage() {
//   const [showPassword, setShowPassword] = useState(false);

//   function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     // Connect your admin authentication API here.
//   }

//   return (
//     <main className="min-h-screen bg-slate-950 text-white">
//       <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
//         {/* Background decoration */}
//         <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
//         <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

//         <div className="relative w-full max-w-md">
//           {/* Brand */}
//           <div className="mb-8 text-center">
//             <Link
//               href="/"
//               className="mx-auto flex w-fit items-center gap-3"
//             >
//               <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-600/20">
//                 <ShieldCheck className="h-6 w-6" />
//               </span>

//               <span className="text-xl font-black">
//                 <span className="text-indigo-400">MCQ</span> Practice
//               </span>
//             </Link>

//             <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-bold text-indigo-300">
//               <KeyRound className="h-3.5 w-3.5" />
//               Administrator Portal
//             </div>
//           </div>

//           {/* Card */}
//           <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/20 sm:p-8">
//             <div className="text-center">
//               <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
//                 <LockKeyhole className="h-6 w-6" />
//               </div>

//               <h1 className="mt-5 text-2xl font-black">
//                 Admin Sign In
//               </h1>

//               <p className="mt-2 text-sm leading-6 text-slate-400">
//                 Sign in with your administrator credentials to access the
//                 management dashboard.
//               </p>
//             </div>

//             <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-900/50 bg-amber-950/20 p-4">
//               <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />

//               <p className="text-xs leading-5 text-amber-300/80">
//                 This area is restricted to authorized administrators only.
//               </p>
//             </div>

//             <form onSubmit={handleSubmit} className="mt-6 space-y-5">
//               <label className="block">
//                 <span className="mb-2 block text-sm font-bold text-slate-200">
//                   Administrator email
//                 </span>

//                 <div className="relative">
//                   <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

//                   <input
//                     type="email"
//                     required
//                     autoComplete="username"
//                     placeholder="admin@example.com"
//                     className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
//                   />
//                 </div>
//               </label>

//               <label className="block">
//                 <div className="mb-2 flex items-center justify-between">
//                   <span className="text-sm font-bold text-slate-200">
//                     Password
//                   </span>

//                   <Link
//                     href="/forgot-password"
//                     className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
//                   >
//                     Forgot password?
//                   </Link>
//                 </div>

//                 <div className="relative">
//                   <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

//                   <input
//                     type={showPassword ? "text" : "password"}
//                     required
//                     autoComplete="current-password"
//                     placeholder="Enter administrator password"
//                     className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-11 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
//                   />

//                   <button
//                     type="button"
//                     onClick={() => setShowPassword((value) => !value)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-slate-300"
//                     aria-label="Toggle password visibility"
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-4 w-4" />
//                     ) : (
//                       <Eye className="h-4 w-4" />
//                     )}
//                   </button>
//                 </div>
//               </label>

//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   className="h-4 w-4 rounded accent-indigo-600"
//                 />

//                 <span className="text-xs text-slate-400">
//                   Keep me signed in
//                 </span>
//               </label>

//               <button
//                 type="submit"
//                 className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
//               >
//                 Sign In to Admin
//                 <ArrowRight className="h-4 w-4" />
//               </button>
//             </form>
//           </section>

//           {/* Bottom links */}
//           <div className="mt-6 flex items-center justify-center gap-4 text-xs">
//             <Link
//               href="/"
//               className="text-slate-500 hover:text-slate-300"
//             >
//               Back to website
//             </Link>

//             <span className="text-slate-700">•</span>

//             <Link
//               href="/login"
//               className="text-slate-500 hover:text-slate-300"
//             >
//               User Login
//             </Link>
//           </div>

//           <p className="mt-5 text-center text-[11px] text-slate-600">
//             Protected administrator area · MCQ Practice
//           </p>
//         </div>
//       </div>
//     </main>
//   );
// }

