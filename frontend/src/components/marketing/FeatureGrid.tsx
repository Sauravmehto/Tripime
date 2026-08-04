import type { ReactNode } from "react";
import { Card } from "../ui/Card";

export interface FeatureItem {
  icon: ReactNode;
  title: string;
  body: string;
}

export function FeatureGrid({ items }: { items: FeatureItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.title} className="h-full">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
            {item.icon}
          </div>
          <h3 className="mt-4 font-semibold text-neutral-900">{item.title}</h3>
          <p className="mt-1.5 text-sm text-neutral-600">{item.body}</p>
        </Card>
      ))}
    </div>
  );
}
