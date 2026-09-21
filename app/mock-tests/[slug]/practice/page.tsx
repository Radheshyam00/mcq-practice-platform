
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { mockTests } from "@/data/mockTests";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PracticePage({
  params,
}: PageProps) {
  const { slug } = await params;

  const test = mockTests.find(
    (item) => item.slug === slug,
  );

  if (!test) {
    notFound();
  }

  const session = await getServerSession(authOptions);

  const isLoggedIn = Boolean(session?.user);

  // Guests are allowed only for the demo.
  if (!isLoggedIn && !test.demo) {
    redirect(
      `/login?callbackUrl=${encodeURIComponent(
        `/mock-tests/${test.slug}/practice`,
      )}`,
    );
  }

  /*
   * Your existing QuizContainer / practice UI goes here.
   *
   * Example:
   *
   * return (
   *   <QuizContainer
   *      test={test}
   *   />
   * );
   */

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          {test.title}
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Practice Test
        </p>

        {/* Replace this section with your existing practice UI */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
          Your existing QuizContainer goes here.
        </div>
      </div>
    </div>
  );
}

