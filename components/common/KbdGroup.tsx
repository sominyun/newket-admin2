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
    <div className="flex flex-wrap gap-1">
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="inline-flex items-center rounded border border-gray-300 bg-white px-1 py-1 text-[12px] leading-none font-normal text-gray-700"
        >
          {item}
        </span>
      ))}
    </div>
  );
}
