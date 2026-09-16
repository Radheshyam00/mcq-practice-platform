"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      setSuccess("Account created successfully. Redirecting...");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto flex min-h-[85vh] max-w-md items-center justify-center">
        <div className="w-full">
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900"
            >
              <BookOpen size={26} />
            </Link>

            <h1 className="text-3xl font-black tracking-tight">
              Create Account
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Start practicing MCQs and improve your score.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:p-8">
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-white dark:focus:ring-white/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-white dark:focus:ring-white/10"
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
                    minLength={6}
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value,
                      })
                    }
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-white dark:focus:ring-white/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
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
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                {loading ? "Creating account..." : "Create Account"}

                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-slate-900 hover:underline dark:text-white"
              >
                Login
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
//   BookOpen,
//   Check,
//   Eye,
//   EyeOff,
//   LockKeyhole,
//   Mail,
//   User,
// } from "lucide-react";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";

// export default function SignupPage() {
//   const router = useRouter();

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] =
//     useState(false);

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] =
//     useState("");

//   const [acceptedTerms, setAcceptedTerms] = useState(false);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   async function handleSubmit(
//     event: FormEvent<HTMLFormElement>
//   ) {
//     event.preventDefault();

//     setError("");
//     setSuccess("");

//     const cleanName = name.trim();
//     const cleanEmail = email.trim().toLowerCase();

//     if (!cleanName) {
//       setError("Please enter your full name.");
//       return;
//     }

//     if (cleanName.length < 2) {
//       setError("Name must contain at least 2 characters.");
//       return;
//     }

//     if (!cleanEmail) {
//       setError("Please enter your email address.");
//       return;
//     }

//     if (password.length < 8) {
//       setError(
//         "Password must contain at least 8 characters."
//       );
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     if (!acceptedTerms) {
//       setError(
//         "Please accept the Terms of Service and Privacy Policy."
//       );
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch("/api/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: cleanName,
//           email: cleanEmail,
//           password,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setError(
//           data.message ||
//             "Unable to create your account."
//         );
//         return;
//       }

//       setSuccess(
//         "Account created successfully. Signing you in..."
//       );

//       // Automatically sign the new user in.
//       const loginResult = await signIn("credentials", {
//         email: cleanEmail,
//         password,
//         redirect: false,
//       });

//       if (loginResult?.error) {
//         // Account exists, but automatic login failed.
//         router.push("/login?registered=true");
//         return;
//       }

//       router.push("/dashboard");
//       router.refresh();
//     } catch (err) {
//       console.error("Signup error:", err);

//       setError(
//         "Something went wrong. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
//       <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
//         <div className="grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[0.9fr_1.1fr]">

//           {/* =====================================================
//               BRANDING
//           ====================================================== */}
//           <section className="relative hidden overflow-hidden bg-slate-950 p-8 lg:flex lg:flex-col lg:justify-between xl:p-10">
//             <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

//             <Link
//               href="/"
//               className="relative flex items-center gap-3"
//             >
//               <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
//                 <BookOpen className="h-5 w-5" />
//               </span>

//               <span className="font-black text-white">
//                 <span className="text-indigo-400">
//                   MCQ
//                 </span>{" "}
//                 Practice
//               </span>
//             </Link>

//             <div className="relative">
//               <h1 className="text-3xl font-black leading-tight text-white xl:text-4xl">
//                 Start your
//                 <span className="block text-indigo-400">
//                   preparation today.
//                 </span>
//               </h1>

//               <p className="mt-4 text-sm leading-6 text-slate-400">
//                 Create your free account and keep track
//                 of your practice, mock tests, results and
//                 progress.
//               </p>

//               <div className="mt-7 space-y-3">
//                 <Benefit text="Practice exam-specific questions" />
//                 <Benefit text="Take timed mock tests" />
//                 <Benefit text="Track your performance" />
//                 <Benefit text="Review your quiz results" />
//               </div>
//             </div>

//             <p className="text-xs text-slate-500">
//               Free exam preparation platform
//             </p>
//           </section>

//           {/* =====================================================
//               FORM
//           ====================================================== */}
//           <section className="p-5 sm:p-8 lg:p-10">
//             <div className="mx-auto max-w-md">

//               {/* Mobile logo */}
//               <Link
//                 href="/"
//                 className="flex w-fit items-center gap-2 lg:hidden"
//               >
//                 <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
//                   <BookOpen className="h-5 w-5" />
//                 </span>

//                 <span className="font-black">
//                   <span className="text-indigo-600 dark:text-indigo-400">
//                     MCQ
//                   </span>{" "}
//                   Practice
//                 </span>
//               </Link>

//               {/* Heading */}
//               <div className="mt-8 lg:mt-0">
//                 <h2 className="text-2xl font-black sm:text-3xl">
//                   Create your account
//                 </h2>

//                 <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
//                   Join MCQ Practice and start preparing
//                   for your exams.
//                 </p>
//               </div>

//               {/* Error */}
//               {error && (
//                 <div
//                   role="alert"
//                   className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
//                 >
//                   {error}
//                 </div>
//               )}

//               {/* Success */}
//               {success && (
//                 <div
//                   role="status"
//                   className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400"
//                 >
//                   {success}
//                 </div>
//               )}

//               <form
//                 onSubmit={handleSubmit}
//                 className="mt-7 space-y-4"
//               >

//                 {/* =================================================
//                     NAME
//                 ================================================== */}
//                 <label className="block">
//                   <span className="mb-2 block text-sm font-bold">
//                     Full name
//                   </span>

//                   <div className="relative">
//                     <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

//                     <input
//                       type="text"
//                       required
//                       autoComplete="name"
//                       value={name}
//                       onChange={(event) =>
//                         setName(event.target.value)
//                       }
//                       placeholder="Your full name"
//                       disabled={loading}
//                       className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:focus:bg-slate-900"
//                     />
//                   </div>
//                 </label>

//                 {/* =================================================
//                     EMAIL
//                 ================================================== */}
//                 <label className="block">
//                   <span className="mb-2 block text-sm font-bold">
//                     Email address
//                   </span>

//                   <div className="relative">
//                     <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

//                     <input
//                       type="email"
//                       required
//                       autoComplete="email"
//                       value={email}
//                       onChange={(event) =>
//                         setEmail(event.target.value)
//                       }
//                       placeholder="you@example.com"
//                       disabled={loading}
//                       className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:focus:bg-slate-900"
//                     />
//                   </div>
//                 </label>

//                 {/* =================================================
//                     PASSWORD
//                 ================================================== */}
//                 <label className="block">
//                   <span className="mb-2 block text-sm font-bold">
//                     Password
//                   </span>

//                   <div className="relative">
//                     <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

//                     <input
//                       type={
//                         showPassword
//                           ? "text"
//                           : "password"
//                       }
//                       required
//                       minLength={8}
//                       autoComplete="new-password"
//                       value={password}
//                       onChange={(event) =>
//                         setPassword(event.target.value)
//                       }
//                       placeholder="At least 8 characters"
//                       disabled={loading}
//                       className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:focus:bg-slate-900"
//                     />

//                     <button
//                       type="button"
//                       onClick={() =>
//                         setShowPassword(
//                           (value) => !value
//                         )
//                       }
//                       disabled={loading}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 disabled:cursor-not-allowed dark:hover:bg-slate-800"
//                       aria-label={
//                         showPassword
//                           ? "Hide password"
//                           : "Show password"
//                       }
//                     >
//                       {showPassword ? (
//                         <EyeOff className="h-4 w-4" />
//                       ) : (
//                         <Eye className="h-4 w-4" />
//                       )}
//                     </button>
//                   </div>
//                 </label>

//                 {/* =================================================
//                     CONFIRM PASSWORD
//                 ================================================== */}
//                 <label className="block">
//                   <span className="mb-2 block text-sm font-bold">
//                     Confirm password
//                   </span>

//                   <div className="relative">
//                     <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

//                     <input
//                       type={
//                         showConfirmPassword
//                           ? "text"
//                           : "password"
//                       }
//                       required
//                       minLength={8}
//                       autoComplete="new-password"
//                       value={confirmPassword}
//                       onChange={(event) =>
//                         setConfirmPassword(
//                           event.target.value
//                         )
//                       }
//                       placeholder="Repeat your password"
//                       disabled={loading}
//                       className={`w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-950 dark:focus:bg-slate-900 ${
//                         confirmPassword &&
//                         confirmPassword !== password
//                           ? "border-red-400 focus:border-red-500"
//                           : "border-slate-200 focus:border-indigo-500 dark:border-slate-700"
//                       }`}
//                     />

//                     <button
//                       type="button"
//                       onClick={() =>
//                         setShowConfirmPassword(
//                           (value) => !value
//                         )
//                       }
//                       disabled={loading}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 disabled:cursor-not-allowed dark:hover:bg-slate-800"
//                       aria-label={
//                         showConfirmPassword
//                           ? "Hide confirm password"
//                           : "Show confirm password"
//                       }
//                     >
//                       {showConfirmPassword ? (
//                         <EyeOff className="h-4 w-4" />
//                       ) : (
//                         <Eye className="h-4 w-4" />
//                       )}
//                     </button>
//                   </div>

//                   {confirmPassword &&
//                     confirmPassword !== password && (
//                       <p className="mt-1.5 text-xs font-medium text-red-500">
//                         Passwords do not match.
//                       </p>
//                     )}
//                 </label>

//                 {/* =================================================
//                     TERMS
//                 ================================================== */}
//                 <label className="flex cursor-pointer items-start gap-2 pt-1">
//                   <input
//                     type="checkbox"
//                     required
//                     checked={acceptedTerms}
//                     onChange={(event) =>
//                       setAcceptedTerms(
//                         event.target.checked
//                       )
//                     }
//                     disabled={loading}
//                     className="mt-0.5 h-4 w-4 rounded accent-indigo-600"
//                   />

//                   <span className="text-xs leading-5 text-slate-500 dark:text-slate-400">
//                     I agree to the Terms of Service and
//                     Privacy Policy.
//                   </span>
//                 </label>

//                 {/* =================================================
//                     SUBMIT
//                 ================================================== */}
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-indigo-500/20 transition hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-slate-900"
//                 >
//                   {loading ? (
//                     <>
//                       <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
//                       Creating account...
//                     </>
//                   ) : (
//                     <>
//                       Create Account
//                       <ArrowRight className="h-4 w-4" />
//                     </>
//                   )}
//                 </button>
//               </form>

//               {/* Login */}
//               <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
//                 Already have an account?{" "}

//                 <Link
//                   href="/login"
//                   className="font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
//                 >
//                   Sign in
//                 </Link>
//               </p>
//             </div>
//           </section>
//         </div>
//       </div>
//     </main>
//   );
// }

// /* =============================================================
//    BENEFIT
// ============================================================= */

// function Benefit({ text }: { text: string }) {
//   return (
//     <div className="flex items-center gap-3 text-sm text-slate-300">
//       <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
//         <Check className="h-3.5 w-3.5" />
//       </span>

//       {text}
//     </div>
//   );
// }

