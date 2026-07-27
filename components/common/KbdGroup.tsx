import { Kbd } from "flowbite-react";
import type { ReactNode } from "react";

interface KbdGroupProps {
  children: ReactNode;
}

export function KbdGroup({ children }: KbdGroupProps) {
  return <div className="flex flex-wrap gap-1.5">{children}</div>;
}

interface KbdListProps {
  items: string[];
}

export function KbdList({ items }: KbdListProps) {
  if (items.length === 0) {
    return <span className="text-gray-400">-</span>;
  }

  return (
    <KbdGroup>
      {items.map((item, index) => (
        <Kbd key={`${item}-${index}`}>{item}</Kbd>
      ))}
    </KbdGroup>
  );
}
