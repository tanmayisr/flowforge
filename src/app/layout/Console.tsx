import { useFlowStore } from "../store/useFlowStore";

export default function Console() {
  const logs = useFlowStore((s) => s.logs);

  return (
    <div className="console">
      {logs.length === 0
        ? "[SYSTEM]: Awaiting Execution..."
        : logs.map((log, i) => <div key={i}>{log}</div>)}
    </div>
  );
}