import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";
import { useFlowStore } from "../store/useFlowStore";

export default function TriggerNode({ id, data }: NodeProps) {

  const executingNodeId = useFlowStore((s) => s.executingNodeId);

  const isRunning = executingNodeId === id;

  return (
    <div
      style={{
        padding: 12,
        background: "#2a2a2c",
        border: isRunning ? "2px solid #00ffee" : "1px solid #ff6a00",
        borderRadius: 6,
        color: "white",
        minWidth: 150,
        boxShadow: isRunning ? "0 0 10px #00ffee" : "none",
      }}
    >
      <strong>TRIGGER</strong>

      <div style={{ marginTop: 6 }}>
        Mode: {data?.mode || "Manual"}
      </div>

      {/* input handle */}
      <Handle type="target" position={Position.Left} />

      {/* output handle */}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}