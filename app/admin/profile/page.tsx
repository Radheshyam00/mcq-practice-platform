"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Camera,
  Check,
  Edit3,
  KeyRound,
  Mail,
  Shield,
  User,
  CalendarDays,
  Save,
  X,
  Lock,
  AlertCircle,
  Loader2,
  Phone,
  FileText,
} from "lucide-react";

type ProfileForm = {
  name: string;
  email: string;
  role: string;
  status: string;
  phone: string;
  bio: string;
  image: string;
};

export default function AdminProfilePage() {
  const { data: session, status: sessionStatus } = useSession();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<ProfileForm>({
    name: "",
    email: "",
    role: "user",
    status: "active",
    phone: "",
    bio: "",
    image: "",
  });

  /*
   * Load profile from MongoDB
   */
  useEffect(() => {
    if (sessionStatus !== "authenticated") {
      if (sessionStatus === "unauthenticated") {
        setLoadingProfile(false);
      }

      return;
    }

    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        setError("");

        const response = await fetch("/api/admin/profile", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load profile"
          );
        }

        setForm({
          name: data.user.name || "",
          email: data.user.email || "",
          role: data.user.role || "user",
          status: data.user.status || "active",
          phone: data.user.phone || "",
          bio: data.user.bio || "",
          image: data.user.image || "",
        });
      } catch (error) {
        console.error("Profile loading error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load profile"
        );
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [sessionStatus]);

  /*
   * Handle form changes
   */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }

    if (saved) {
      setSaved(false);
    }
  };

  /*
   * Save profile
   */
  const handleSave = async () => {
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          bio: form.bio.trim(),
          image: form.image.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update profile"
        );
      }

      setForm((prev) => ({
        ...prev,
        name: data.user.name || "",
        email: data.user.email || "",
        role: data.user.role || "user",
        status: data.user.status || "active",
        phone: data.user.phone || "",
        bio: data.user.bio || "",
        image: data.user.image || "",
      }));

      setSaved(true);
      setEditing(false);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error("Profile update error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * Cancel editing
   */
  const handleCancel = () => {
    setEditing(false);
    setError("");

    /*
     * Reload the database version so unsaved
     * changes are discarded.
     */
    if (sessionStatus === "authenticated") {
      loadProfileAgain();
    }
  };

  /*
   * Reload profile helper
   */
  const loadProfileAgain = async () => {
    try {
      setLoadingProfile(true);
      setError("");

      const response = await fetch("/api/admin/profile", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load profile"
        );
      }

      setForm({
        name: data.user.name || "",
        email: data.user.email || "",
        role: data.user.role || "user",
        status: data.user.status || "active",
        phone: data.user.phone || "",
        bio: data.user.bio || "",
        image: data.user.image || "",
      });
    } catch (error) {
      console.error("Profile reload error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to reload profile"
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  /*
   * Session loading
   */
  if (sessionStatus === "loading" || loadingProfile) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />

            <div className="space-y-2">
              <div className="h-6 w-40 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-64 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <div className="h-[500px] animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />

            <div className="space-y-6">
              <div className="h-[500px] animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-40 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Not authenticated
   */
  if (sessionStatus === "unauthenticated") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
            <Lock size={24} />
          </div>

          <h1 className="mt-5 text-xl font-bold">
            Authentication Required
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Please sign in to access your administrator profile.
          </p>

          <Link
            href="/admin/login"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Go to Admin Login
          </Link>
        </div>
      </main>
    );
  }

  const displayName =
    form.name || session?.user?.name || "Administrator";

  const avatarLetter =
    displayName.charAt(0).toUpperCase() || "A";

  const isActive = form.status === "active";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Back to dashboard"
            >
              <ArrowLeft size={19} />
            </Link>

            <div>
              <h1 className="text-xl font-bold">
                My Profile
              </h1>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Manage your administrator account
              </p>
            </div>
          </div>

          {!editing ? (
            <button
              type="button"
              onClick={() => {
                setError("");
                setSaved(false);
                setEditing(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <Edit3 size={16} />
              Edit Profile
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <X size={16} />
              Cancel
            </button>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold">
                Something went wrong
              </p>

              <p className="mt-0.5">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Success */}
        {saved && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
              <Check size={15} />
            </div>

            Profile updated successfully.
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Profile Card */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="relative">
                {form.image ? (
                  <img
                    src={form.image}
                    alt={displayName}
                    className="h-28 w-28 rounded-full object-cover shadow-lg shadow-indigo-500/20"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-4xl font-bold text-white shadow-lg shadow-indigo-500/20">
                    {avatarLetter}
                  </div>
                )}

                <button
                  type="button"
                  disabled
                  title="Profile image upload can be connected later"
                  className="absolute bottom-1 right-1 flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-full border-4 border-white bg-indigo-600 text-white opacity-90 shadow-md dark:border-slate-900"
                >
                  <Camera size={15} />
                </button>
              </div>

              <h2 className="mt-5 text-xl font-bold">
                {displayName}
              </h2>

              <p className="mt-1 max-w-full truncate text-sm text-slate-500 dark:text-slate-400">
                {form.email || "Administrator"}
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold capitalize text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400">
                <Shield size={13} />
                {form.role.replaceAll("-", " ")}
              </div>
            </div>

            <div className="my-6 border-t border-slate-200 dark:border-slate-800" />

            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                  <Mail
                    size={16}
                    className="text-slate-500 dark:text-slate-400"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Email
                  </p>

                  <p className="truncate text-sm font-medium">
                    {form.email || "Not available"}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                  <Phone
                    size={16}
                    className="text-slate-500 dark:text-slate-400"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Phone
                  </p>

                  <p className="truncate text-sm font-medium">
                    {form.phone || "Not provided"}
                  </p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                  <Shield
                    size={16}
                    className="text-slate-500 dark:text-slate-400"
                  />
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Account Role
                  </p>

                  <p className="text-sm font-medium capitalize">
                    {form.role.replaceAll("-", " ")}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                  <CalendarDays
                    size={16}
                    className="text-slate-500 dark:text-slate-400"
                  />
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Account Status
                  </p>

                  <p
                    className={`text-sm font-medium capitalize ${
                      isActive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {form.status}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Main */}
          <div className="space-y-6">
            {/* Personal Information */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                    <User size={19} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Personal Information
                    </h2>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Update your basic account information
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    disabled={!editing || saving}
                    placeholder="Enter your name"
                    maxLength={100}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:placeholder:text-slate-600 dark:focus:border-indigo-500 dark:disabled:bg-slate-950/50 dark:disabled:text-slate-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-500"
                  />

                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Email address cannot be changed from this page.
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    disabled={!editing || saving}
                    placeholder="Enter phone number"
                    maxLength={30}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:placeholder:text-slate-600 dark:focus:border-indigo-500 dark:disabled:bg-slate-950/50 dark:disabled:text-slate-500"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label
                    htmlFor="bio"
                    className="mb-2 block text-sm font-medium"
                  >
                    Bio
                  </label>

                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={form.bio}
                    onChange={handleChange}
                    disabled={!editing || saving}
                    placeholder="Write something about yourself..."
                    maxLength={500}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:placeholder:text-slate-600 dark:focus:border-indigo-500 dark:disabled:bg-slate-950/50 dark:disabled:text-slate-500"
                  />

                  <p className="mt-1 text-right text-xs text-slate-400">
                    {form.bio.length}/500
                  </p>
                </div>

                {/* Image URL */}
                {editing && (
                  <div>
                    <label
                      htmlFor="image"
                      className="mb-2 block text-sm font-medium"
                    >
                      Profile Image URL
                    </label>

                    <input
                      id="image"
                      name="image"
                      type="url"
                      value={form.image}
                      onChange={handleChange}
                      disabled={saving}
                      placeholder="https://example.com/profile.jpg"
                      maxLength={2000}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:placeholder:text-slate-600 dark:focus:border-indigo-500"
                    />
                  </div>
                )}

                {/* Save */}
                {editing && (
                  <div className="flex justify-end border-t border-slate-200 pt-5 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? (
                        <>
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Security */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                    <Lock size={18} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Security
                    </h2>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Manage your account security
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                      <KeyRound
                        size={18}
                        className="text-slate-500 dark:text-slate-400"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        Password
                      </p>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Change your administrator password
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/admin/forgot-password"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Change Password
                  </Link>
                </div>
              </div>
            </section>

            {/* Permissions */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <Shield size={18} />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Administrator Access
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Your account permissions determine which
                    administrator features you can access.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  "Dashboard",
                  "Questions",
                  "Exams",
                  "Mock Tests",
                  "Users",
                  "Results",
                ].map((permission) => (
                  <div
                    key={permission}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-800"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                      <Check
                        size={12}
                        strokeWidth={3}
                      />
                    </div>

                    <span>{permission}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Account information */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <FileText size={18} />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Account Information
                  </h2>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Your account email, role and status are managed
                    by the administrator system.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Account Type
                    </p>

                    <p className="mt-1 text-sm font-semibold capitalize">
                      {form.role.replaceAll("-", " ")}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Status
                    </p>

                    <p
                      className={`mt-1 text-sm font-semibold capitalize ${
                        isActive
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {form.status}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Email
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold">
                      {form.email || "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}