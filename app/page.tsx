
import { Features } from "@/components/home/Features";
import { Hero } from "@/components/home/Hero";
import { PopularExams } from "@/components/home/PopularExams";
import { Stats } from "@/components/home/Stats";

export default function HomePage() {
  return (
    <main
      className="
        min-h-screen
        overflow-x-hidden
        bg-white
        text-slate-900
        dark:bg-slate-950
        dark:text-slate-100
      "
    >
      <Hero />

      <Stats />

      <PopularExams />

      <Features />
    </main>
  );
}
