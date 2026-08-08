import type { ReactNode } from "react";
import { Footer } from "./layout/Footer";
import { Header } from "./layout/Header";
import { FloatingHelp } from "./layout/FloatingHelp";
import { PageContainer } from "./ui/Card";

interface LayoutProps {
  children: ReactNode;
  /** Full-bleed content (e.g. homepage hero) — skips default page padding wrapper */
  bare?: boolean;
  /** Transparent header over hero. Defaults to `bare`. Set false for light full-bleed pages. */
  overlay?: boolean;
  narrow?: boolean;
}

export function Layout({
  children,
  bare = false,
  overlay = bare,
  narrow = false,
}: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-elevated"
      >
        Skip to main content
      </a>
      <Header overlay={overlay} />
      {bare ? (
        <main id="main-content" className="flex-1">
          {children}
        </main>
      ) : (
        <main id="main-content" className="flex-1 py-8 sm:py-10">
          <PageContainer narrow={narrow}>{children}</PageContainer>
        </main>
      )}
      <Footer />
      <FloatingHelp />
    </div>
  );
}
