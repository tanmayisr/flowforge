import { Handle, Position } from "reactflow";
import { useFlowStore } from "../store/useFlowStore";

export default function ActionNode({ id, data }: any) {

  const present = useFlowStore((s) => s.present);
  const executingNodeId = useFlowStore((s) => s.executingNodeId);

  const isRunning = executingNodeId === id;

  const updateNode = (newData: any) => {

    const nodes = present.nodes.map((node) => {
      if (node.id === id) {
        return {
          ...node,
          data: {
            ...node.data,
            ...newData,
          },
        };
      }
      return node;
    });

    useFlowStore.getState().commit({
      ...present,
      nodes,
    });
  };

  return (
    <div
      style={{
        padding: 12,
        background: "#2a2a2c",
        border: isRunning ? "2px solid #00ffee" : "1px solid #ef4444",
        borderRadius: 6,
        color: "white",
        minWidth: 150,
        boxShadow: isRunning ? "0 0 10px #00ffee" : "none",
      }}
    >
      <strong>ACTION</strong>

      <div style={{ marginTop: 6 }}>
        <select
          value={data.actionType}
          onChange={(e) =>
            updateNode({ actionType: e.target.value })
          }
        >
          <option>Fan ON</option>
          <option>Fan OFF</option>
          <option>Send Alert</option>
        </select>
      </div>

      <Handle type="target" position={Position.Left} />
    </div>
  );
}