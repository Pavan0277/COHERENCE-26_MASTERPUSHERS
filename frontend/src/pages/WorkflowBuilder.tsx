import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  ReactFlowProvider,
  Panel,
} from "@xyflow/react";
import type { Node, Edge, Connection, ReactFlowInstance } from "@xyflow/react";
import type { KeyboardEventHandler } from "react";
import "@xyflow/react/dist/style.css";

import { useWorkflow } from "../store/workflowStore";
import {
  createWorkflow,
  updateWorkflow,
  getWorkflowById,
  runWorkflow,
} from "../services/api";

import NodeConfigPanel from "../components/NodeConfigPanel";
import AiGeneratorModal from "../components/AiGeneratorModal";
import UploadNode from "../components/nodes/UploadNode";
import FilterNode from "../components/nodes/FilterNode";
import AiMessageNode from "../components/nodes/AiMessageNode";
import SendNode from "../components/nodes/SendNode";
import DelayNode from "../components/nodes/DelayNode";
import CallNode from "../components/nodes/CallNode";

import {
  Upload,
  Filter,
  Sparkles,
  Send,
  Timer,
  Phone,
  Save,
  Play,
  Loader2,
  ChevronLeft,
  Trash2,
  MousePointerSquareDashed,
  Check,
  Mail,
  MessageSquare,
} from "lucide-react";

const nodeTypes = {
  upload: UploadNode,
  filter: FilterNode,
  ai_message: AiMessageNode,
  send: SendNode,
  delay: DelayNode,
  call: CallNode,
};

const NODE_PALETTE = [
  { type: "upload",     label: "Upload Leads", description: "Import CSV / Excel",         icon: Upload,   color: "bg-blue-500",   text: "text-blue-700",   bg: "bg-blue-50" },
  { type: "filter",     label: "Filter",       description: "Narrow down leads",          icon: Filter,   color: "bg-purple-500", text: "text-purple-700", bg: "bg-purple-50" },
  { type: "ai_message", label: "AI Message",   description: "Generate with Gemini",       icon: Sparkles, color: "bg-green-500",  text: "text-green-700",  bg: "bg-green-50" },
  { type: "send",       label: "Send Message", description: "Email · Slack · Telegram",   icon: Send,     color: "bg-orange-500", text: "text-orange-700", bg: "bg-orange-50" },
  { type: "delay",      label: "Delay",        description: "Wait before next step",      icon: Timer,    color: "bg-gray-500",   text: "text-gray-700",   bg: "bg-gray-50" },
  { type: "call",       label: "VAPI Call",     description: "AI voice call via VAPI",     icon: Phone,    color: "bg-sky-500",    text: "text-sky-700",    bg: "bg-sky-50" },
] as const;

const NODE_LABELS: Record<string, string> = Object.fromEntries(
  NODE_PALETTE.map((p) => [p.type, p.label])
);

// Seed layout shown for brand-new workflows
const SEED_NODES: Node[] = [
  { id: "upload-seed", type: "upload",     position: { x: 280, y: 60 },   data: { label: "Upload Leads", config: {} } },
  { id: "filter-seed", type: "filter",     position: { x: 280, y: 260 },  data: { label: "Filter",       config: { filters: [] } } },
  { id: "ai-seed",     type: "ai_message", position: { x: 280, y: 460 },  data: { label: "AI Message",   config: { instructions: "" } } },
  { id: "send-seed",   type: "send",       position: { x: 280, y: 660 },  data: { label: "Send Message", config: { platform: "email", followup: false } } },
  { id: "delay-seed",  type: "delay",      position: { x: 280, y: 860 },  data: { label: "Delay",        config: { min: 172800, max: 180000 } } },
  { id: "followup-seed", type: "send",     position: { x: 280, y: 1060 }, data: { label: "Send Message", config: { platform: "email", followup: true } } },
];

const SEED_EDGES: Edge[] = [
  ["upload-seed", "filter-seed"],
  ["filter-seed", "ai-seed"],
  ["ai-seed",     "send-seed"],
  ["send-seed",   "delay-seed"],
  ["delay-seed",  "followup-seed"],
].map(([source, target], i) => ({
  id: `seed-e-${i}`,
  source,
  target,
  animated: true,
  markerEnd: { type: MarkerType.ArrowClosed },
}));

const DEFAULT_CONFIGS: Record<string, Record<string, unknown>> = {
  upload: {},
  filter: { filters: [] },
  ai_message: { instructions: "" },
  send: { platform: "email", followup: false },
  delay: { min: 3600, max: 7200 },
};

function WorkflowBuilderInner() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    workflowId,
    workflowName,
    nodes,
    edges,
    setWorkflow,
    setWorkflowName,
    onNodesChange,
    onEdgesChange,
    onConnect: storeConnect,
    addNode,
    updateNodeConfig,
    removeNode,
    reset,
    setPlatformForAllSendNodes,
  } = useWorkflow();

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);
  const [running, setRunning]         = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [toast, setToast]             = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  // Keep selectedNode in sync when nodes array changes
  useEffect(() => {
    if (!selectedNode) return;
    const latest = nodes.find((n) => n.id === selectedNode.id);
    if (latest) setSelectedNode(latest);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes]);

  // Load existing workflow or seed a new one
  useEffect(() => {
    if (id === "new") {
      reset();
      setWorkflow("", "Untitled Workflow", SEED_NODES, SEED_EDGES);
      return;
    }
    if (!id) return;
    getWorkflowById(id)
      .then((res) => {
        const wf = res.data.workflow ?? res.data;
        setWorkflow(
          wf._id,
          wf.name,
          (wf.nodes || []).map((n: { id: string; type: string; config?: Record<string, unknown>; position?: { x: number; y: number } }) => ({
            id: n.id,
            type: n.type,
            position: n.position || { x: 200, y: 200 },
            data: { label: NODE_LABELS[n.type] || n.type, config: n.config || {} },
          })),
          wf.edges || []
        );
      })
      .catch(() => showToast("Failed to load workflow", "error"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Drag from palette
  const onDragStart = (e: React.DragEvent, nodeType: string) => {
    e.dataTransfer.setData("application/reactflow", nodeType);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!rfInstance || !reactFlowWrapper.current) return;
      const nodeType = e.dataTransfer.getData("application/reactflow");
      if (!nodeType) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = rfInstance.screenToFlowPosition({
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      });

      const newNode: Node = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position,
        data: {
          label: NODE_LABELS[nodeType] || nodeType,
          config: { ...DEFAULT_CONFIGS[nodeType] },
        },
      };
      addNode(newNode);
    },
    [rfInstance, addNode]
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onConnect = useCallback(
    (connection: Connection) => storeConnect(connection),
    [storeConnect]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Keyboard Delete / Backspace removes selected node; ⌘S / Ctrl+S saves
  const onKeyDown: KeyboardEventHandler = useCallback(
    (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
        return;
      }
      if ((e.key === "Delete" || e.key === "Backspace") && selectedNode) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        removeNode(selectedNode.id);
        setSelectedNode(null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedNode, removeNode]
  );

  const handleDeleteNode = (nodeId: string) => {
    removeNode(nodeId);
    setSelectedNode(null);
  };

  // Serialize nodes for the API
  const serializeNodes = () =>
    nodes.map((n) => ({
      id: n.id,
      type: n.type,
      position: n.position,
      config: (n.data as { config?: Record<string, unknown> }).config || {},
    }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        name: workflowName,
        nodes: serializeNodes(),
        edges: edges.map((e: Edge) => ({
          id: e.id,
          source: e.source,
          target: e.target,
        })),
      };

      if (workflowId) {
          await updateWorkflow(workflowId, payload);
          showToast("Workflow saved!", "success");
        } else {
          const res = await createWorkflow(payload);
          const created = res.data.workflow ?? res.data;
          setWorkflow(created._id, created.name, nodes, edges);
          navigate(`/workflows/${created._id}`, { replace: true });
          showToast("Workflow created!", "success");
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    } catch {
      showToast("Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleRun = async () => {
    if (!workflowId) {
      showToast("Save the workflow first", "error");
      return;
    }
    setRunning(true);
    try {
      await runWorkflow(workflowId);
      showToast("Workflow started successfully", "success");
    } catch {
      showToast("Failed to start workflow", "error");
    } finally {
      setRunning(false);
    }
  };

  const handleAiGenerate = (wf: { nodes: { id?: string; type: string; config?: Record<string, unknown> }[]; edges: { source: string; target: string }[] }) => {
    const newNodes: Node[] = (wf.nodes || []).map(
      (n: { id?: string; type: string; config?: Record<string, unknown> }, i: number) => ({
        id: n.id || `${n.type}-${Date.now()}-${i}`,
        type: n.type,
        position: { x: 260, y: 40 + i * 130 },
        data: {
          label: NODE_LABELS[n.type] || n.type,
          config: n.config || DEFAULT_CONFIGS[n.type] || {},
        },
      })
    );
    const newEdges: Edge[] = (wf.edges || []).map(
      (e: { source: string; target: string }, i: number) => ({
        id: `e-${i}`,
        source: e.source,
        target: e.target,
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { strokeWidth: 2 },
      })
    );
    setWorkflow(workflowId || "", workflowName, newNodes, newEdges);
    setShowAiModal(false);
    showToast("Workflow generated!", "success");
    // Fit view after React re-renders the new nodes
    setTimeout(() => rfInstance?.fitView({ padding: 0.3, duration: 500 }), 100);
  };

  const getSaveIcon = () => {
    if (saving) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (saved)  return <Check className="h-4 w-4" />;
    return <Save className="h-4 w-4" />;
  };
  const getSaveLabel = () => {
    if (saving) return "Saving\u2026";
    if (saved)  return "Saved!";
    return "Save";
  };

  return (
    <div
      className="flex h-screen flex-col bg-gray-50 outline-none overflow-hidden"
      tabIndex={-1}
      onKeyDown={onKeyDown}
    >
      {/* Top bar */}
      <header className="flex h-16 shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-5 shadow-sm z-10">
        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
          title="Back to dashboard"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="h-5 w-px bg-gray-200" />
        <input
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
          className="min-w-0 max-w-xs flex-1 rounded-md border border-transparent bg-transparent px-2 py-1.5 text-[17px] font-semibold text-gray-800 hover:border-gray-200 focus:border-gray-300 focus:outline-none"
        />
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleRun}
            disabled={running || !workflowId}
            className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Run
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 transition ${
              saved
                ? "bg-green-600 hover:bg-green-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {getSaveIcon()}
            {getSaveLabel()}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left palette */}
        <aside className="flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-4 py-3.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Nodes</p>
            <p className="mt-0.5 text-xs text-gray-400">Drag onto canvas</p>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {NODE_PALETTE.map((item) => (
              <button
                type="button"
                key={item.type}
                draggable
                onKeyDown={(e) => { if (e.key === "Enter") onDragStart(e as unknown as React.DragEvent, item.type); }}
                onDragStart={(e) => onDragStart(e, item.type)}
                className={`flex w-full cursor-grab items-center gap-3 rounded-xl border border-gray-100 ${item.bg} px-3 py-3 shadow-sm hover:shadow-md active:cursor-grabbing active:opacity-70 transition`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0 text-left">
                  <p className={`text-sm font-semibold ${item.text}`}>{item.label}</p>
                  <p className="truncate text-xs text-gray-400">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="border-t border-gray-100 px-3 py-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Send Channel</p>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { value: "email",    label: "Email",    Icon: Mail,          active: "bg-blue-50 border-blue-300 text-blue-700",   idle: "border-gray-200 text-gray-500 hover:bg-gray-50" },
                { value: "slack",    label: "Slack",    Icon: MessageSquare, active: "bg-pink-50 border-pink-300 text-pink-700",   idle: "border-gray-200 text-gray-500 hover:bg-gray-50" },
                { value: "telegram", label: "Telegram", Icon: Send,          active: "bg-sky-50 border-sky-300 text-sky-700",     idle: "border-gray-200 text-gray-500 hover:bg-gray-50" },
              ].map(({ value, label, Icon, active, idle }) => {
                const isActive = nodes.some(
                  (n) => n.type === "send" && (n.data as { config?: { platform?: string } }).config?.platform === value
                );
                return (
                  <button
                    key={value}
                    onClick={() => setPlatformForAllSendNodes(value)}
                    title={`Set all Send nodes to ${label}`}
                    className={`flex flex-col items-center gap-1 rounded-lg border py-2 text-[10px] font-medium transition ${
                      isActive ? active : idle
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-[10px] text-gray-400">Applies to all Send nodes</p>
          </div>
          <div className="border-t border-gray-100 px-4 py-3 text-[11px] text-gray-400 space-y-0.5">
            <p>• Click a node to configure</p>
            <p>• Delete / ⌫ to remove</p>
          </div>
        </aside>

        {/* Canvas */}
        <div
          ref={reactFlowWrapper}
          className="flex-1 overflow-hidden"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onInit={setRfInstance}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            defaultEdgeOptions={{
              animated: true,
              markerEnd: { type: MarkerType.ArrowClosed },
              style: { strokeWidth: 2 },
            }}
            deleteKeyCode={null}
          >
            <Background gap={24} color="#e5e7eb" size={1.5} />
            <Controls />
            <MiniMap nodeStrokeWidth={3} zoomable pannable className="!rounded-xl !border-gray-200" />
            {nodes.length === 0 && (
              <Panel position="top-center">
                <div className="mt-20 flex flex-col items-center gap-2 text-center text-gray-400 select-none pointer-events-none">
                  <MousePointerSquareDashed className="h-10 w-10 opacity-30" />
                  <p className="text-sm font-medium">Drag nodes from the left panel</p>
                  <p className="text-xs">or use Generate with AI ✨</p>
                </div>
              </Panel>
            )}
          </ReactFlow>
        </div>

        {/* Right config panel */}
        {selectedNode && (
          <aside className="flex w-80 shrink-0 flex-col overflow-hidden border-l border-gray-200 bg-white shadow-lg">
            <NodeConfigPanel
              node={selectedNode as unknown as { id: string; type: string; data: { label: string; config?: Record<string, unknown> } }}
              workflowId={workflowId}
              onUpdateConfig={updateNodeConfig}
              onClose={() => setSelectedNode(null)}
            />
            <div className="border-t border-gray-100 p-3">
              <button
                onClick={() => handleDeleteNode(selectedNode.id)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition"
              >
                <Trash2 className="h-4 w-4" />
                Delete node
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* Floating AI Assistant button + panel */}
      {!showAiModal && (
        <button
          onClick={() => setShowAiModal(true)}
          className="fixed bottom-6 right-6 z-50 group flex items-center gap-2 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 px-4 py-3 text-white shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 hover:scale-105 active:scale-95 transition-all duration-200"
          title="Open AI Workflow Assistant"
        >
          <span className="relative flex h-5 w-5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-25" />
            <Sparkles className="relative h-5 w-5" />
          </span>
          <span className="text-sm font-semibold tracking-tight">AI Assistant</span>
        </button>
      )}
      {showAiModal && (
        <AiGeneratorModal
          onGenerate={handleAiGenerate}
          onClose={() => setShowAiModal(false)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
            toast.type === "success" ? "bg-green-600" : "bg-red-500"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}

export default function WorkflowBuilder() {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderInner />
    </ReactFlowProvider>
  );
}
