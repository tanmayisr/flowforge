import FlowCanvas from "./app/canvas/FlowCanvas";
import Sidebar from "./app/layout/Sidebar";
import Inspector from "./app/layout/Inspector";
import Console from "./app/layout/Console";
import Taskbar from "./app/layout/Taskbar";
import { useFlowStore } from "./app/store/useFlowStore";

export default function App() {
  const theme = useFlowStore((s) => s.theme);

  const isDark = theme === "dark";

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: isDark
          ? "linear-gradient(180deg,#0f172a,#020617)"
          : "#f1f5f9",
        color: isDark ? "#e5e7eb" : "#111827",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* WORK AREA */}
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
        }}
      >
        {/* Sidebar */}
        <Sidebar />

        {/* Canvas */}
        <div
          style={{
            flex: 1,
            position: "relative",
          }}
        >
          <FlowCanvas />
        </div>

        {/* Inspector */}
        <Inspector />
      </div>

      {/* Console */}
      <div
        style={{
          height: "140px",
          borderTop: isDark
            ? "1px solid #1e293b"
            : "1px solid #d1d5db",
          background: isDark ? "#020617" : "#ffffff",
        }}
      >
        <Console />
      </div>

      {/* Taskbar */}
      <div
        style={{
          height: "60px",
          borderTop: isDark
            ? "1px solid #1e293b"
            : "1px solid #d1d5db",
          background: isDark ? "#020617" : "#ffffff",
        }}
      >
        <Taskbar />
      </div>
    </div>
  );
}