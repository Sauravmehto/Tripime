import type { ReactNode } from "react";
import { PageContainer } from "../ui/Card";

type SectionTone = "plain" | "white" | "dark";

interface SectionProps {
  children: ReactNode;
  tone?: SectionTone;
  narrow?: boolean;
  className?: string;
  id?: string;
}

const tones: Record<SectionTone, string> = {
  plain: "",
  white: "border-y border-neutral-200 bg-white",
  dark: "bg-primary-800 text-white",
};

export function Section({
  children,
  tone = "plain",
  narrow = false,
  className = "",
  id,
}: SectionProps) {
  return (
    <section id={id} className={`${tones[tone]} ${className}`}>
      <PageContainer narrow={narrow} className="py-16 sm:py-20">
        {children}
      </PageContainer>
    </section>
  );
}
