import { Badge } from "../ui/Card";
import { Card } from "../ui/Card";

interface OfferItem {
  title: string;
  body: string;
  code?: string;
}

export function OfferCards({ items }: { items: OfferItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.title} className="h-full">
          <h3 className="font-semibold text-neutral-900">{item.title}</h3>
          <p className="mt-1.5 text-sm text-neutral-600">{item.body}</p>
          {item.code && (
            <div className="mt-3">
              <Badge tone="primary">Use code: {item.code}</Badge>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
