import { create } from "zustand";
import { addEdge, applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import type { Node, Edge, Connection, NodeChange, EdgeChange } from "@xyflow/react";

interface WorkflowState {
  // ── state ──────────────────────────────────────────────
  workflowId: string | null;
  workflowName: string;
  nodes: Node[];
  edges: Edge[];
  detectedColumns: Record<string, string>;

  // ── actions ─────────────────────────────────────────────
  setWorkflow: (id: string, name: string, nodes: Node[], edges: Edge[]) => void;
  setWorkflowName: (name: string) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: Node) => void;
  updateNodeConfig: (nodeId: string, config: Record<string, unknown>) => void;
  removeNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  /** Sets config.platform on every "send" node in the current workflow */
  setPlatformForAllSendNodes: (platform: string) => void;
  /** Alias for setDetectedColumns — matches requested API */
  setColumns: (cols: Record<string, string>) => void;
  setDetectedColumns: (cols: Record<string, string>) => void;
  reset: () => void;
}

const INITIAL: Pick<WorkflowState, "workflowId" | "workflowName" | "nodes" | "edges" | "detectedColumns"> = {
  workflowId: null,
  workflowName: "Untitled Workflow",
  nodes: [],
  edges: [],
  detectedColumns: {},
};

export const useWorkflow = create<WorkflowState>((set) => ({
  ...INITIAL,

  setWorkflow: (id, name, nodes, edges) =>
    set({ workflowId: id || null, workflowName: name, nodes, edges }),

  setWorkflowName: (name) => set({ workflowName: name }),

  onNodesChange: (changes) =>
    set((s) => ({ nodes: applyNodeChanges(changes, s.nodes) })),

  onEdgesChange: (changes) =>
    set((s) => ({ edges: applyEdgeChanges(changes, s.edges) })),

  onConnect: (connection) =>
    set((s) => ({ edges: addEdge({ ...connection, animated: true }, s.edges) })),

  addNode: (node) =>
    set((s) => ({ nodes: [...s.nodes, node] })),

  updateNodeConfig: (nodeId, config) =>
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, config } } : n
      ),
    })),

  removeNode: (nodeId) =>
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== nodeId),
      edges: s.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
    })),

  duplicateNode: (nodeId) =>
    set((s) => {
      const src = s.nodes.find((n) => n.id === nodeId);
      if (!src) return {};
      const newId = `${src.type ?? "node"}-${Date.now()}`;
      const clone: Node = {
        ...src,
        id: newId,
        position: { x: src.position.x + 40, y: src.position.y + 60 },
        data: { ...src.data },
        selected: false,
      };
      return { nodes: [...s.nodes, clone] };
    }),

  setPlatformForAllSendNodes: (platform) =>
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.type === "send"
          ? { ...n, data: { ...n.data, config: { ...(n.data.config as Record<string, unknown>), platform } } }
          : n
      ),
    })),

  setDetectedColumns: (cols) => set({ detectedColumns: cols }),
  setColumns: (cols) => set({ detectedColumns: cols }),

  reset: () => set({ ...INITIAL }),
}));

/** Legacy provider shim — no longer wraps anything but kept so existing
 *  imports of WorkflowProvider in main.tsx don't break during migration. */
export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

