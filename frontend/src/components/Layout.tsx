import type { ReactNode } from "react";
import { Footer } from "./layout/Footer";
import { Header } from "./layout/Header";
import { PageContainer } from "./ui/Card";

interface LayoutProps {
  children: ReactNode;
  /** Full-bleed content (e.g. homepage hero) — skips default page padding wrapper */
  bare?: boolean;
  narrow?: boolean;
}

export function Layout({ children, bare = false, narrow = false }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <Header />
      {bare ? (
        <main className="flex-1">{children}</main>
      ) : (
        <main className="flex-1 py-8 sm:py-10">
          <PageContainer narrow={narrow}>{children}</PageContainer>
        </main>
      )}
      <Footer />
    </div>
  );
}
