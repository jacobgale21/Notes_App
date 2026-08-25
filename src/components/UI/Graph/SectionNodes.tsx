import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { Node } from "../../../data/types";

export function NodeNode({ data }: NodeProps) {
  const node = data as Node;
  return (
    <div className="w-64 rounded-2xl border border-line bg-card p-4 shadow-sm">
      <Handle type="target" position={Position.Top} />
      <h3 className="text-lg flex flex-row items-center justify-start gap-3">
        {node.icon && <node.icon className="w-4 h-4" />}
        {node.title}
      </h3>
      <p className="text-sm text-muted">{node.description}</p>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
