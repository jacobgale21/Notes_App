import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { Section } from "../../../data/placeholder";

export function SectionNode({ data }: NodeProps) {
  const section = data as Section;
  return (
    <div className="w-64 rounded-2xl border border-line bg-card p-4 shadow-sm">
      <Handle type="target" position={Position.Top} />
      <h2 className="text-lg">{section.heading}</h2>
      <ul className="mt-2 text-sm text-muted">
        {section.subsections.slice(0, 3).map((s) => (
          <li key={s.heading}>{s.heading}</li>
        ))}
      </ul>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
