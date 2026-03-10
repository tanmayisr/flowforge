import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import { useFlowStore } from "../store/useFlowStore";

import TriggerNode from "../nodes/TriggerNode";
import ConditionNode from "../nodes/ConditionNode";
import ActionNode from "../nodes/ActionNode";

const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
};

export default function FlowCanvas() {

  const present = useFlowStore((s) => s.present);
  const onNodesChange = useFlowStore((s) => s.onNodesChange);
  const onEdgesChange = useFlowStore((s) => s.onEdgesChange);
  const onConnect = useFlowStore((s) => s.onConnect);
  const theme = useFlowStore((s) => s.theme);
const isValidConnection = (connection: any) => {
  const nodes = present.nodes;

  const sourceNode = nodes.find((n) => n.id === connection.source);
  const targetNode = nodes.find((n) => n.id === connection.target);

  if (!sourceNode || !targetNode) return false;

  const sourceType = sourceNode.type;
  const targetType = targetNode.type;

  if (sourceType === "trigger" && targetType === "condition") return true;

  if (sourceType === "condition" && targetType === "condition") return true;

  if (sourceType === "condition" && targetType === "action") return true;

  return false;
};
  return (
    <div style={{ width: "100%", height: "100%", position: "relative"}}>
      <ReactFlow
        nodes={present.nodes}
        edges={present.edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        isValidConnection={isValidConnection}
      >
        <Background
          color={theme === "dark" ? "#2a2a2c" : "#ccc"}
          gap={40}
        />
        <Controls />
      </ReactFlow>
    </div>
  );
}