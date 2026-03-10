import { useFlowStore } from "../store/useFlowStore";

export default function Taskbar() {

  const runWorkflow = useFlowStore((s) => s.runWorkflow);
  const undo = useFlowStore((s) => s.undo);
  const redo = useFlowStore((s) => s.redo);
  const toggleTheme = useFlowStore((s) => s.toggleTheme);
  const theme = useFlowStore((s) => s.theme);
  const clearCanvas = useFlowStore((s) => s.clearCanvas);
  const present = useFlowStore((s) => s.present);

  /* EXPORT WORKFLOW */

  const exportWorkflow = () => {
    const data = JSON.stringify(present, null, 2);

    const blob = new Blob([data], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "flowforge-workflow.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  /* IMPORT WORKFLOW */

  const importWorkflow = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);

        useFlowStore.setState({
          present: data,
          past: [],
          future: [],
        });

        localStorage.setItem(
          "flowforge-workflow",
          JSON.stringify(data)
        );

      } catch {
        alert("Invalid workflow file");
      }
    };

    reader.readAsText(file);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        padding: 10,
        borderTop: "1px solid #444",
        alignItems: "center",
      }}
    >
      <button className="btn btn-neutral" onClick={undo}>
  Undo
</button>

      <button className="btn btn-neutral" onClick={redo}>
  Redo
</button>

      <button
        onClick={runWorkflow}
        style={{
          background: "#00aa55",
          color: "white",
          padding: "6px 12px",
          border: "none",
          borderRadius: 4,
        }}
      >
        ▶ Run Automation
      </button>

      <button className="btn btn-blue" onClick={toggleTheme}>
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </button>

      <button
        onClick={clearCanvas}
        style={{
          background: "#cc3333",
          color: "white",
          padding: "6px 12px",
          border: "none",
          borderRadius: 4,
        }}
      >
        Clear Canvas
      </button>

      <button onClick={exportWorkflow}>
        Export Workflow
      </button>

      <label
        style={{
          cursor: "pointer",
        }}
      >
        Import Workflow
        <input
          type="file"
          accept=".json"
          style={{ display: "none" }}
          onChange={importWorkflow}
        />
      </label>
    </div>
  );
}