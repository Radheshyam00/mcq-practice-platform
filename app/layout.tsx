import type { Metadata, Viewport } from "next";
import Providers from "@/components/Providers";
import "./globals.css";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },

  description: APP_DESCRIPTION,

  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="
          min-h-screen
          bg-white
          text-slate-900
          antialiased
          selection:bg-indigo-500/20
          selection:text-indigo-900
          dark:bg-slate-950
          dark:text-slate-100
          dark:selection:bg-indigo-400/20
          dark:selection:text-indigo-100
        "
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-1">
              {children}
            </main>

            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}


