import { Handle, Position } from "reactflow";
import { useFlowStore } from "../store/useFlowStore";

export default function ConditionNode({ id, data }: any) {

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
        border: isRunning ? "2px solid #00ffee" : "1px solid #3b82f6",
        borderRadius: 6,
        color: "white",
        minWidth: 150,
        boxShadow: isRunning ? "0 0 10px #00ffee" : "none",
      }}
    >
      <strong>CONDITION</strong>

      <div style={{ marginTop: 6 }}>
        <select
          value={data.operator}
          onChange={(e) =>
            updateNode({ operator: e.target.value })
          }
        >
          <option value=">">{">"}</option>
          <option value="<">{"<"}</option>
          <option value="==">{"=="}</option>
        </select>
      </div>

      <div style={{ marginTop: 6 }}>
        <input
          type="number"
          value={data.value}
          onChange={(e) =>
            updateNode({ value: Number(e.target.value) })
          }
          style={{ width: "100%" }}
        />
      </div>

      <Handle type="target" position={Position.Left} />

      <Handle
        type="source"
        position={Position.Right}
        id="yes"
        style={{ top: 20 }}
      />

      <Handle
        type="source"
        position={Position.Right}
        id="no"
        style={{ top: 50 }}
      />
    </div>
  );
}