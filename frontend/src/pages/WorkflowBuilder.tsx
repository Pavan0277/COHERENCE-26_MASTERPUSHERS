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
import type { Node, Edge, Connection, ReactFlowInstance, NodeChange } from "@xyflow/react";
import type { KeyboardEventHandler } from "react";
import "@xyflow/react/dist/style.css";

import { useWorkflow } from "../store/workflowStore";
import {
  createWorkflow,
  updateWorkflow,
  getWorkflowById,
  runWorkflow,
} from "../services/api";

import Sidebar from "../components/Sidebar";
import NodeConfigPanel from "../components/NodeConfigPanel";
import AiGeneratorModal from "../components/AiGeneratorModal";
import UploadNode from "../components/nodes/UploadNode";
import FilterNode from "../components/nodes/FilterNode";
import AiMessageNode from "../components/nodes/AiMessageNode";
import SendNode from "../components/nodes/SendNode";
import DelayNode from "../components/nodes/DelayNode";
import CallNode from "../components/nodes/CallNode";
import WebhookNode from "../components/nodes/WebhookNode";
import ConditionNode from "../components/nodes/ConditionNode";
import TagNode from "../components/nodes/TagNode";
import SmsNode from "../components/nodes/SmsNode";
import ScoreNode from "../components/nodes/ScoreNode";
import NotifyNode from "../components/nodes/NotifyNode";
import SplitNode from "../components/nodes/SplitNode";
import UpdateFieldNode from "../components/nodes/UpdateFieldNode";
import AiClassifyNode from "../components/nodes/AiClassifyNode";
import WhatsAppNode from "../components/nodes/WhatsAppNode";
import LinkedInNode from "../components/nodes/LinkedInNode";
import WaitUntilNode from "../components/nodes/WaitUntilNode";
import TransformNode from "../components/nodes/TransformNode";
import StopNode from "../components/nodes/StopNode";
import EnrichNode from "../components/nodes/EnrichNode";
import MeetingNode from "../components/nodes/MeetingNode";
import HttpRequestNode from "../components/nodes/HttpRequestNode";

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
  ChevronRight,
  Trash2,
  MousePointerSquareDashed,
  Check,
  Mail,
  MessageSquare,
  GitBranch,
  Plus,
  Webhook,
  Tag,
  Star,
  Bell,
  Shuffle,
  PenLine,
  Brain,
  MessageCircle,
  Link2,
  Clock,
  Zap,
  StopCircle,
  Database,
  Calendar,
  Globe,
} from "lucide-react";

const nodeTypes = {
  upload:       UploadNode,
  filter:       FilterNode,
  ai_message:   AiMessageNode,
  send:         SendNode,
  delay:        DelayNode,
  call:         CallNode,
  webhook:      WebhookNode,
  condition:    ConditionNode,
  tag:          TagNode,
  sms:          SmsNode,
  score:        ScoreNode,
  notify:       NotifyNode,
  split:        SplitNode,
  update_field: UpdateFieldNode,
  ai_classify:  AiClassifyNode,
  whatsapp:     WhatsAppNode,
  linkedin:     LinkedInNode,
  wait_until:   WaitUntilNode,
  transform:    TransformNode,
  stop:         StopNode,
  enrich:       EnrichNode,
  meeting:      MeetingNode,
  http_request: HttpRequestNode,
};

const NODE_PALETTE = [
  { type: "upload",       label: "Upload Leads",     description: "Import CSV / Excel",          icon: Upload,       color: "bg-blue-500",    text: "text-blue-700",    bg: "bg-blue-50" },
  { type: "filter",       label: "Filter",           description: "Narrow down leads",           icon: Filter,       color: "bg-purple-500",  text: "text-purple-700",  bg: "bg-purple-50" },
  { type: "ai_message",   label: "AI Message",       description: "Generate with Sarvam AI",     icon: Sparkles,     color: "bg-green-500",   text: "text-green-700",   bg: "bg-green-50" },
  { type: "send",         label: "Send Message",     description: "Email · Slack · Telegram",    icon: Send,         color: "bg-orange-500",  text: "text-orange-700",  bg: "bg-orange-50" },
  { type: "delay",        label: "Delay",            description: "Wait before next step",       icon: Timer,        color: "bg-gray-500",    text: "text-gray-700",    bg: "bg-gray-50" },
  { type: "call",         label: "VAPI Call",        description: "AI voice call via VAPI",      icon: Phone,        color: "bg-sky-500",     text: "text-sky-700",     bg: "bg-sky-50" },
  { type: "webhook",      label: "Webhook",          description: "POST to external URL",        icon: Webhook,      color: "bg-rose-500",    text: "text-rose-700",    bg: "bg-rose-50" },
  { type: "condition",    label: "Condition",        description: "Branch on lead field",        icon: GitBranch,    color: "bg-amber-500",   text: "text-amber-700",   bg: "bg-amber-50" },
  { type: "tag",          label: "Tag Lead",         description: "Label lead for CRM",          icon: Tag,          color: "bg-indigo-500",  text: "text-indigo-700",  bg: "bg-indigo-50" },
  { type: "sms",          label: "Send SMS",         description: "SMS via Twilio",              icon: MessageSquare, color: "bg-fuchsia-500", text: "text-fuchsia-700", bg: "bg-fuchsia-50" },
  { type: "score",        label: "Score Lead",       description: "Add / set lead score",        icon: Star,         color: "bg-cyan-500",    text: "text-cyan-700",    bg: "bg-cyan-50" },
  { type: "notify",       label: "Notify",           description: "Internal alert to yourself",  icon: Bell,         color: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  { type: "split",        label: "A/B Split",        description: "Random % pass-through",       icon: Shuffle,      color: "bg-violet-500",  text: "text-violet-700",  bg: "bg-violet-50" },
  { type: "update_field", label: "Update Field",     description: "Set any lead field value",    icon: PenLine,      color: "bg-teal-500",    text: "text-teal-700",    bg: "bg-teal-50" },
  { type: "ai_classify",  label: "AI Classify",      description: "Score leads with AI",         icon: Brain,        color: "bg-pink-500",    text: "text-pink-700",    bg: "bg-pink-50" },
  { type: "whatsapp",     label: "WhatsApp",         description: "Send via WhatsApp (Twilio)",  icon: MessageCircle, color: "bg-green-600",  text: "text-green-800",   bg: "bg-green-50" },
  { type: "linkedin",     label: "LinkedIn",         description: "Automate via webhook",        icon: Link2,        color: "bg-blue-700",    text: "text-blue-900",    bg: "bg-blue-50" },
  { type: "wait_until",   label: "Wait Until",       description: "Pause until exact datetime",  icon: Clock,        color: "bg-orange-500",  text: "text-orange-700",  bg: "bg-orange-50" },
  { type: "transform",    label: "Data Transform",   description: "Mutate a lead field value",   icon: Zap,          color: "bg-stone-500",   text: "text-stone-700",   bg: "bg-stone-50" },
  { type: "stop",         label: "Stop / End",       description: "Terminate the workflow",      icon: StopCircle,   color: "bg-red-500",     text: "text-red-700",     bg: "bg-red-50" },
  { type: "enrich",       label: "Enrich Lead",      description: "Fetch data from APIs",        icon: Database,     color: "bg-yellow-600",  text: "text-yellow-800",  bg: "bg-yellow-50" },
  { type: "meeting",      label: "Meeting Link",     description: "Send Calendly / booking URL", icon: Calendar,     color: "bg-teal-600",    text: "text-teal-800",    bg: "bg-teal-50" },
  { type: "http_request", label: "HTTP Request",     description: "Call any external API",       icon: Globe,        color: "bg-gray-700",    text: "text-gray-900",    bg: "bg-gray-100" },
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
  upload:       {},
  filter:       { filters: [] },
  ai_message:   { instructions: "" },
  send:         { platform: "email", followup: false },
  delay:        { min: 3600, max: 7200 },
  call:         {},
  webhook:      { url: "", method: "POST" },
  condition:    { column: "email", operator: "not_empty", value: "" },
  tag:          { tag: "", color: "#6366f1" },
  sms:          { message: "", from: "" },
  score:        { value: 10, operation: "add" },
  notify:       { channel: "email", message: "", subject: "Workflow Notification — {name}" },
  split:        { percentage: 50 },
  update_field: { field: "name", value: "" },
  ai_classify:  { instructions: "", categories: ["hot", "warm", "cold"], outputField: "classification" },
  whatsapp:     { message: "", from: "" },
  linkedin:     { automationUrl: "", subject: "", message: "" },
  wait_until:   { datetime: "", timezone: "UTC" },
  transform:    { field: "name", operation: "uppercase", find: "", replace: "", template: "", outputField: "" },
  stop:         { reason: "", status: "completed" },
  enrich:       { provider: "hunter", apiKey: "", lookupField: "email" },
  meeting:      { platform: "Calendly", url: "", message: "Hi {name}, book a time: {bookingUrl}", channel: "email" },
  http_request: { url: "", method: "POST", headers: "{}", body: "", outputField: "" },
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

  const [selectedNode, setSelectedNode]       = useState<Node | null>(null);
  const [saving, setSaving]                   = useState(false);
  const [saved, setSaved]                     = useState(false);
  const [running, setRunning]                 = useState(false);
  const [showAiModal, setShowAiModal]         = useState(false);
  const [toast, setToast]                     = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [paletteSearch, setPaletteSearch]       = useState("");

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  // Keep selectedNode in sync; close panel when the node is deleted
  useEffect(() => {
    if (!selectedNode) return;
    const latest = nodes.find((n) => n.id === selectedNode.id);
    if (latest) setSelectedNode(latest);
    else setSelectedNode(null);
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

  // Close the config panel when the currently-displayed node is removed
  // (covers keyboard delete, toolbar delete, and any other deletion path)
  const onNodesChangeLocal = useCallback(
    (changes: NodeChange[]) => {
      const removedIds = changes
        .filter((c): c is { type: "remove"; id: string } => c.type === "remove")
        .map((c) => c.id);
      if (selectedNode && removedIds.includes(selectedNode.id)) {
        setSelectedNode(null);
      }
      onNodesChange(changes);
    },
    [selectedNode, onNodesChange]
  );

  // Clicking an edge de-selects the node config panel
  const onEdgeClickHandler = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // ⌘S / Ctrl+S saves; Delete key is handled natively by ReactFlow
  const onKeyDown: KeyboardEventHandler = useCallback(
    (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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
    if (!workflowName.trim()) {
      showToast("Please enter a workflow name", "error");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: workflowName.trim(),
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
        style: { strokeWidth: 2, stroke: "#6366f1" },
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
      className="flex h-screen flex-col bg-slate-50 outline-none"
      tabIndex={-1}
      onKeyDown={onKeyDown}
    >
      {/* ── Top Bar ─────────────────────────────────────────────── */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 shadow-sm z-20">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shrink-0">
            <GitBranch className="h-3.5 w-3.5 text-white" />
          </div>
          <input
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            placeholder="Workflow name"
            aria-label="Workflow name"
            className={`min-w-0 max-w-sm flex-1 rounded-lg border bg-transparent px-2 py-1 text-[15px] font-semibold text-slate-800 hover:border-slate-200 focus:bg-slate-50/80 focus:outline-none focus:ring-2 transition-all ${
              workflowName.trim()
                ? "border-transparent focus:border-indigo-300 focus:ring-indigo-100"
                : "border-red-300 focus:border-red-400 focus:ring-red-100"
            }`}
          />
        </div>

        <div className="flex items-center gap-2 ml-auto shrink-0">
          <button
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700 hover:bg-violet-100 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI Generate
          </button>
          <button
            onClick={handleRun}
            disabled={running || !workflowId}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-40 transition-colors"
          >
            {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
            Run
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-semibold text-white disabled:opacity-40 transition-all duration-200 ${
              saved
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {getSaveIcon()}
            {getSaveLabel()}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">        {/* ── Main App Sidebar ────────────────────────────── */}
        <Sidebar />
        {/* ── Left Sidebar (light, collapsible) ──────────────────── */}
        <aside
          className={`flex shrink-0 flex-col bg-white border-r border-slate-200 transition-all duration-300 overflow-hidden ${
            sidebarCollapsed ? "w-14" : "w-[252px]"
          }`}
        >
          {/* Header row with collapse toggle */}
          <div className="flex h-10 items-center px-3 border-b border-slate-100">
            {!sidebarCollapsed && (
              <p className="flex-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Components
              </p>
            )}
            <button
              onClick={() => setSidebarCollapsed((c) => !c)}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={`flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors ${
                sidebarCollapsed ? "mx-auto" : ""
              }`}
            >
              {sidebarCollapsed
                ? <ChevronRight className="h-4 w-4" />
                : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* Palette search — hidden when collapsed */}
          {!sidebarCollapsed && (
            <div className="px-2 pt-2 pb-1">
              <input
                type="search"
                value={paletteSearch}
                onChange={(e) => setPaletteSearch(e.target.value)}
                placeholder="Search nodes\u2026"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[12px] text-slate-700 placeholder-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-100"
              />
            </div>
          )}

          {/* Node palette */}
          <div className="flex-1 space-y-0.5 overflow-y-auto px-2 py-2">
            {(paletteSearch
              ? NODE_PALETTE.filter(
                  (item) =>
                    item.label.toLowerCase().includes(paletteSearch.toLowerCase()) ||
                    item.description.toLowerCase().includes(paletteSearch.toLowerCase())
                )
              : NODE_PALETTE
            ).map((item) => (
              <button
                type="button"
                key={item.type}
                draggable
                title={sidebarCollapsed ? item.label : undefined}
                onKeyDown={(e) => { if (e.key === "Enter") onDragStart(e as unknown as React.DragEvent, item.type); }}
                onDragStart={(e) => onDragStart(e, item.type)}
                className={`group flex w-full cursor-grab items-center gap-3 rounded-xl text-left hover:bg-slate-50 active:cursor-grabbing active:scale-[0.97] transition-all duration-150 ${
                  sidebarCollapsed ? "justify-center px-0 py-2" : "px-2 py-2.5"
                }`}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.color} shadow-md`}>
                  <item.icon className="h-[18px] w-[18px] text-white" />
                </div>
                {!sidebarCollapsed && (
                  <>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                        {item.label}
                      </p>
                      <p className="truncate text-[11px] text-slate-400 group-hover:text-slate-500 transition-colors">
                        {item.description}
                      </p>
                    </div>
                    <Plus className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Send channel — hidden when collapsed */}
          {!sidebarCollapsed && (
          <div className="border-t border-slate-200 px-4 py-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              Send Channel
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { value: "email",    label: "Email",    Icon: Mail },
                { value: "slack",    label: "Slack",    Icon: MessageSquare },
                { value: "telegram", label: "Telegram", Icon: Send },
              ].map(({ value, label, Icon }) => {
                const isActive = nodes.some(
                  (n) => n.type === "send" && (n.data as { config?: { platform?: string } }).config?.platform === value
                );
                return (
                  <button
                    key={value}
                    onClick={() => setPlatformForAllSendNodes(value)}
                    title={`Set all Send nodes to ${label}`}
                    className={`flex flex-col items-center gap-1.5 rounded-xl py-2.5 text-[10px] font-semibold uppercase tracking-wide transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[10px] text-slate-400">Applies to all Send nodes</p>
          </div>
          )}

          {/* Shortcuts — hidden when collapsed */}
          {!sidebarCollapsed && (
          <div className="border-t border-slate-200 px-4 py-3 space-y-1.5">
            <div className="flex items-center gap-2">
              <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-500">⌘S</kbd>
              <span className="text-[11px] text-slate-500">Save workflow</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-500">Del</kbd>
              <span className="text-[11px] text-slate-500">Delete node / edge</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-500">click edge</kbd>
              <span className="text-[11px] text-slate-500">Select, then Del</span>
            </div>
          </div>
          )}
        </aside>

        {/* ── Canvas + overlay right panel ────────────────────────── */}
        <div className="relative flex-1 overflow-hidden">
          {/* Canvas */}
          <div
            ref={reactFlowWrapper}
            className="absolute inset-0"
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChangeLocal}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              onEdgeClick={onEdgeClickHandler}
              onInit={setRfInstance}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.3 }}
              defaultEdgeOptions={{
                animated: true,
                markerEnd: { type: MarkerType.ArrowClosed },
                style: { strokeWidth: 2, stroke: "#6366f1" },
              }}
              deleteKeyCode="Delete"
            >
              <Background gap={20} size={1.5} color="#e2e8f0" />
              <Controls className="!rounded-xl !border !border-slate-200 !shadow-lg" />
              <MiniMap
                nodeStrokeWidth={3}
                zoomable
                pannable
                className="!rounded-xl !border !border-slate-200 !shadow-lg"
                nodeColor={(node) => {
                  const colors: Record<string, string> = {
                    upload:       "#3b82f6", filter:       "#8b5cf6",
                    ai_message:   "#10b981", send:         "#f97316",
                    delay:        "#64748b", call:         "#0ea5e9",
                    webhook:      "#f43f5e", condition:    "#f59e0b",
                    tag:          "#6366f1", sms:          "#d946ef",
                    score:        "#06b6d4", notify:       "#059669",
                    split:        "#7c3aed", update_field: "#14b8a6",
                    ai_classify:  "#ec4899", whatsapp:     "#16a34a",
                    linkedin:     "#1d4ed8", wait_until:   "#ea580c",
                    transform:    "#78716c", stop:         "#ef4444",
                    enrich:       "#ca8a04", meeting:      "#0d9488",
                    http_request: "#374151",
                  };
                  return colors[node.type || ""] || "#94a3b8";
                }}
              />
              {nodes.length === 0 && (
                <Panel position="top-center">
                  <div className="mt-28 flex flex-col items-center gap-3 text-center select-none pointer-events-none">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl border border-slate-200">
                      <MousePointerSquareDashed className="h-7 w-7 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-slate-600">Build your workflow</p>
                      <p className="text-[12px] text-slate-400 mt-0.5">
                        Drag components from the left · or use AI Generate ✨
                      </p>
                    </div>
                  </div>
                </Panel>
              )}
            </ReactFlow>
          </div>

          {/* Right config panel — slides over canvas */}
          {selectedNode && (
            <aside className="absolute right-0 top-0 z-10 flex h-full w-[360px] flex-col overflow-hidden border-l border-slate-200 bg-white shadow-2xl animate-slide-in-right">
              <NodeConfigPanel
                node={selectedNode as unknown as { id: string; type: string; data: { label: string; config?: Record<string, unknown> } }}
                workflowId={workflowId}
                onUpdateConfig={updateNodeConfig}
                onClose={() => setSelectedNode(null)}
              />
              <div className="border-t border-slate-100 p-3">
                <button
                  onClick={() => handleDeleteNode(selectedNode.id)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete node
                </button>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* AI Modal */}
      {showAiModal && (
        <AiGeneratorModal
          onGenerate={handleAiGenerate}
          onClose={() => setShowAiModal(false)}
        />
      )}

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 flex items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-semibold shadow-2xl animate-fade-up ${
            toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" && <Check className="h-4 w-4 shrink-0" />}
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
