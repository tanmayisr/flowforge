import { useFlowStore } from "../store/useFlowStore";

export default function Sidebar() {
  const addTrigger = useFlowStore((s) => s.addTrigger);
  const addCondition = useFlowStore((s) => s.addCondition);
  const addAction = useFlowStore((s) => s.addAction);

  return (
    <div
      className="glass"
      style={{
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <h3 style={{ fontSize: 16 }}>ARCHITECT</h3>

      <button
        onClick={addTrigger}
        style={{
          padding: 10,
          background: "#ff6a00",
          border: "none",
          color: "white",
          cursor: "pointer",
          borderRadius: 4,
        }}
      >
        + Add Trigger
      </button>

      <button
        onClick={addCondition}
        style={{
          padding: 10,
          background: "#1f4fff",
          border: "none",
          color: "white",
          cursor: "pointer",
          borderRadius: 4,
        }}
      >
        + Add Condition
      </button>

      <button
        onClick={addAction}
        style={{
          padding: 10,
          background: "#c1121f",
          border: "none",
          color: "white",
          cursor: "pointer",
          borderRadius: 4,
        }}
      >
        + Add Action
      </button>
    </div>
  );
}