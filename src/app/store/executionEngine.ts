import type { Node, Edge } from "reactflow";

/* ---------------- VALIDATION ---------------- */

function validateWorkflow(
  nodes: Node[],
  edges: Edge[],
  log: (msg: string) => void
) {
  const trigger = nodes.find((n) => n.type === "trigger");

  if (!trigger) {
    log("[ERROR] No Trigger Found.");
    return false;
  }

  const triggerEdge = edges.find((e) => e.source === trigger.id);

  if (!triggerEdge) {
    log("[ERROR] Trigger not connected.");
    return false;
  }

  const conditions = nodes.filter((n) => n.type === "condition");

  for (const condition of conditions) {
    const outputs = edges.filter((e) => e.source === condition.id);

    if (outputs.length === 0) {
      log(`[ERROR] Condition ${condition.id} has no output.`);
      return false;
    }
  }

  return true;
}

/* ---------------- EXECUTION ENGINE ---------------- */

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function runAutomation(
  nodes: Node[],
  edges: Edge[],
  log: (msg: string) => void,
  setExecutingNode: (id: string | null) => void
) {

  log("[SYSTEM] Starting Automation...");

  /* VALIDATION STEP */

  if (!validateWorkflow(nodes, edges, log)) {
    log("[SYSTEM] Execution stopped due to validation errors.");
    return;
  }

  // 🔹 Find Trigger
  const trigger = nodes.find((n) => n.type === "trigger");

  if (!trigger) {
    log("[ERROR] No Trigger Found.");
    return;
  }

  /* HIGHLIGHT TRIGGER */

  setExecutingNode(trigger.id);
  await delay(700);

  // Simulated temperature sensor value
  const temperature = 35;
  log(`[TRIGGER] Temperature reading: ${temperature}°C`);

  // 🔹 Find edge from Trigger
  const triggerEdge = edges.find(
    (e) => e.source === trigger.id
  );

  if (!triggerEdge) {
    log("[ERROR] Trigger not connected.");
    setExecutingNode(null);
    return;
  }

  // 🔹 Get Condition
  const condition = nodes.find(
    (n) => n.id === triggerEdge.target
  );

  if (!condition || condition.type !== "condition") {
    log("[ERROR] Trigger must connect to Condition.");
    setExecutingNode(null);
    return;
  }

  /* HIGHLIGHT CONDITION */

  setExecutingNode(condition.id);
  await delay(700);

  const operator = condition.data.operator;
  const value = condition.data.value;

  let result = false;

  if (operator === ">") result = temperature > value;
  if (operator === "<") result = temperature < value;
  if (operator === "==") result = temperature === value;

  log(
    `[CONDITION] ${temperature} ${operator} ${value} → ${
      result ? "YES" : "NO"
    }`
  );

  // 🔹 Choose YES / NO branch
  const branchEdge = edges.find(
    (e) =>
      e.source === condition.id &&
      e.sourceHandle === (result ? "yes" : "no")
  );

  if (!branchEdge) {
    log("[SYSTEM] No action connected to this branch.");
    setExecutingNode(null);
    return;
  }

  // 🔹 Get Action
  const action = nodes.find(
    (n) => n.id === branchEdge.target
  );

  if (!action || action.type !== "action") {
    log("[ERROR] Invalid Action.");
    setExecutingNode(null);
    return;
  }

  /* HIGHLIGHT ACTION */

  setExecutingNode(action.id);
  await delay(700);

  log(`[ACTION] Executing: ${action.data.actionType}`);

  log("[SYSTEM] Automation Complete.");

  /* CLEAR HIGHLIGHT */

  setExecutingNode(null);
}