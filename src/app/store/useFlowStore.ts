import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";

import type {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
} from "reactflow";

import { runAutomation } from "./executionEngine";

/* ---------------- TYPES ---------------- */

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
}

interface FlowState {
  /* Theme */
  theme: "light" | "dark";
  toggleTheme: () => void;

  /* Workflow */
  past: WorkflowState[];
  present: WorkflowState;
  future: WorkflowState[];

  logs: string[];

  /* NEW: Execution highlight */
  executingNodeId: string | null;
  setExecutingNode: (id: string | null) => void;

  commit: (newState: WorkflowState) => void;

  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  addTrigger: () => void;
  addCondition: () => void;
  addAction: () => void;

  undo: () => void;
  redo: () => void;

  clearCanvas: () => void;

  runWorkflow: () => void;
  addLog: (msg: string) => void;
}

/* ---------------- HELPERS ---------------- */

const clone = (state: WorkflowState): WorkflowState => ({
  nodes: JSON.parse(JSON.stringify(state.nodes)),
  edges: JSON.parse(JSON.stringify(state.edges)),
});

/* SAVE WORKFLOW */

const saveWorkflow = (state: WorkflowState) => {
  localStorage.setItem(
    "flowforge-workflow",
    JSON.stringify(state)
  );
};

/* LOAD WORKFLOW */

const loadWorkflow = (): WorkflowState => {
  const saved = localStorage.getItem("flowforge-workflow");

  if (!saved) {
    return { nodes: [], edges: [] };
  }

  try {
    return JSON.parse(saved);
  } catch {
    return { nodes: [], edges: [] };
  }
};

/* ---------------- STORE ---------------- */

export const useFlowStore = create<FlowState>((set, get) => ({
  /* THEME */

  theme: "dark",

  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",
    })),

  /* WORKFLOW */

  past: [],
  present: loadWorkflow(),
  future: [],
  logs: [],

  /* NEW: Execution state */

  executingNodeId: null,

  setExecutingNode: (id) =>
    set({
      executingNodeId: id,
    }),

  /* COMMIT */

  commit: (newState) => {
    const { present, past } = get();

    saveWorkflow(newState);

    set({
      past: [...past, clone(present)],
      present: newState,
      future: [],
    });
  },

  /* NODE CHANGES */

  onNodesChange: (changes) => {
    const { present } = get();

    const newNodes = applyNodeChanges(
      changes,
      present.nodes
    );

    const meaningfulChange = changes.some(
      (c) => c.type === "position" || c.type === "remove"
    );

    if (!meaningfulChange) {
      set({
        present: { ...present, nodes: newNodes },
      });
      return;
    }

    get().commit({
      ...present,
      nodes: newNodes,
    });
  },

  /* EDGE CHANGES */

  onEdgesChange: (changes) => {
    const { present } = get();

    const newEdges = applyEdgeChanges(
      changes,
      present.edges
    );

    get().commit({
      ...present,
      edges: newEdges,
    });
  },

  /* CONNECT */

  onConnect: (connection) => {
    const { present } = get();

    const newEdges = addEdge(
      connection,
      present.edges
    );

    get().commit({
      ...present,
      edges: newEdges,
    });
  },

  /* ADD NODES */

  addTrigger: () => {
    const { present } = get();

    const newNode: Node = {
      id: crypto.randomUUID(),
      type: "trigger",
      position: { x: 200, y: 150 },
      data: { mode: "Manual" },
    };

    get().commit({
      ...present,
      nodes: [...present.nodes, newNode],
    });
  },

  addCondition: () => {
    const { present } = get();

    const newNode: Node = {
      id: crypto.randomUUID(),
      type: "condition",
      position: { x: 450, y: 200 },
      data: { operator: ">", value: 30 },
    };

    get().commit({
      ...present,
      nodes: [...present.nodes, newNode],
    });
  },

  addAction: () => {
    const { present } = get();

    const newNode: Node = {
      id: crypto.randomUUID(),
      type: "action",
      position: { x: 750, y: 200 },
      data: { actionType: "Fan ON" },
    };

    get().commit({
      ...present,
      nodes: [...present.nodes, newNode],
    });
  },

  /* UNDO */

  undo: () => {
    const { past, present, future } = get();

    if (past.length === 0) return;

    const previous = past[past.length - 1];

    set({
      past: past.slice(0, -1),
      present: previous,
      future: [clone(present), ...future],
    });
  },

  /* REDO */

  redo: () => {
    const { past, present, future } = get();

    if (future.length === 0) return;

    const next = future[0];

    set({
      past: [...past, clone(present)],
      present: next,
      future: future.slice(1),
    });
  },

  /* CLEAR CANVAS */

  clearCanvas: () => {
    set({
      past: [],
      present: { nodes: [], edges: [] },
      future: [],
    });
  },

  /* LOGS */

  addLog: (msg) =>
    set({
      logs: [...get().logs, msg],
    }),

  /* EXECUTION */

  runWorkflow: () => {
    set({ logs: [] });

    runAutomation(
      get().present.nodes,
      get().present.edges,
      get().addLog,
      get().setExecutingNode
    );
  },
}));