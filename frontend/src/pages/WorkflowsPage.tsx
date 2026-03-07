import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GitBranch,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  Check,
  X,
  ArrowRight,
} from "lucide-react";
import { getWorkflows, updateWorkflow, deleteWorkflow } from "../services/api";

interface Workflow {
  _id: string;
  name: string;
  nodes: unknown[];
  edges: unknown[];
  createdAt: string;
  updatedAt?: string;
}

export default function WorkflowsPage() {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  // Inline rename state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getWorkflows()
      .then((res) => {
        const data = res.data.workflows ?? res.data;
        setWorkflows(Array.isArray(data) ? data : []);
      })
      .catch(() => setWorkflows([]))
      .finally(() => setLoading(false));
  }, []);

  // Focus input when entering edit mode
  useEffect(() => {
    if (editingId) {
      setTimeout(() => editInputRef.current?.select(), 30);
    }
  }, [editingId]);

  const startEdit = (wf: Workflow, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(wf._id);
    setEditName(wf.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const commitRename = async (id: string) => {
    const trimmed = editName.trim();
    if (!trimmed || renamingId) return;
    const original = workflows.find((w) => w._id === id)?.name ?? "";
    if (trimmed === original) { cancelEdit(); return; }
    setRenamingId(id);
    // Optimistic update
    setWorkflows((prev) => prev.map((wf) => wf._id === id ? { ...wf, name: trimmed } : wf));
    setEditingId(null);
    try {
      await updateWorkflow(id, { name: trimmed });
    } catch {
      // Revert on failure
      setWorkflows((prev) => prev.map((wf) => wf._id === id ? { ...wf, name: original } : wf));
    } finally {
      setRenamingId(null);
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") { e.preventDefault(); void commitRename(id); }
    if (e.key === "Escape") cancelEdit();
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteWorkflow(id);
      setWorkflows((prev) => prev.filter((wf) => wf._id !== id));
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-heading">Workflows</h1>
          <p className="text-base text-body-light mt-0.5">
            Build and manage your outreach automation pipelines
          </p>
        </div>
        <button
          onClick={() => navigate("/workflows/new")}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all duration-150"
        >
          <Plus className="h-5 w-5" />
          New Workflow
        </button>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-gray-100 shrink-0" />
                <div className="flex-1 space-y-2 pt-0.5">
                  <div className="h-4 w-3/4 rounded bg-gray-100" />
                  <div className="h-3 w-1/2 rounded bg-gray-100" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-16 rounded-lg bg-gray-100" />
                <div className="h-6 w-16 rounded-lg bg-gray-100" />
              </div>
              <div className="flex gap-2 pt-1">
                <div className="h-8 flex-1 rounded-xl bg-gray-100" />
                <div className="h-8 w-10 rounded-xl bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && workflows.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-gray-200 bg-white py-28 animate-fade-up">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 ring-4 ring-indigo-50/60">
            <GitBranch className="h-7 w-7 text-indigo-500" />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-heading">No workflows yet</p>
            <p className="text-sm text-body-light mt-1 max-w-xs">
              Create your first automation workflow to start reaching leads at scale.
            </p>
          </div>
          <button
            onClick={() => navigate("/workflows/new")}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 active:scale-95 transition-all duration-150 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Create your first workflow
          </button>
        </div>
      )}

      {/* Workflow grid */}
      {!loading && workflows.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workflows.map((wf, idx) => (
            <div
              key={wf._id}
              className="group relative flex flex-col gap-0 rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 overflow-hidden animate-fade-up"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              {/* Card top accent */}
              <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />

              <div className="flex flex-col gap-3 p-5">
                {/* Icon + name row */}
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100">
                    <GitBranch className="h-6 w-6 text-indigo-600" />
                  </div>

                  <div className="min-w-0 flex-1">
                    {editingId === wf._id ? (
                      /* ── Inline rename input ── */
                      <div className="flex items-center gap-1.5 animate-fade-up">
                        <input
                          ref={editInputRef}
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => handleEditKeyDown(e, wf._id)}
                          onBlur={() => { /* handled by buttons */ }}
                          maxLength={80}
                          className="min-w-0 flex-1 rounded-lg border border-indigo-300 bg-indigo-50/50 px-2 py-0.5 text-sm font-semibold text-heading focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                          autoComplete="off"
                        />
                        <button
                          onClick={() => void commitRename(wf._id)}
                          disabled={!editName.trim()}
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors"
                          title="Save (Enter)"
                        >
                          {renamingId === wf._id
                            ? <Loader2 className="h-3 w-3 animate-spin" />
                            : <Check className="h-3 w-3" />}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
                          title="Cancel (Esc)"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      /* ── Name display ── */
                      <div className="flex items-center gap-1.5 min-w-0">
                        <p className="truncate text-base font-semibold text-heading leading-snug">
                          {wf.name}
                        </p>
                        <button
                          onClick={(e) => startEdit(wf, e)}
                          title="Rename workflow"
                          className="shrink-0 rounded p-0.5 text-gray-300 opacity-0 group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-600 transition-all duration-150"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    <p className="text-sm text-body-light mt-0.5">
                      {wf.updatedAt ? `Updated ${formatDate(wf.updatedAt)}` : `Created ${formatDate(wf.createdAt)}`}
                    </p>
                  </div>
                </div>

                {/* Stats chips */}
                <div className="flex gap-2">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 border border-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">
                    {wf.nodes.length} node{wf.nodes.length === 1 ? "" : "s"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 border border-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">
                    {wf.edges.length} edge{wf.edges.length === 1 ? "" : "s"}
                  </span>
                </div>

                {/* Action row */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => navigate(`/workflows/${wf._id}`)}
                    className="group/btn flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 active:scale-95 transition-all duration-150 shadow-sm"
                  >
                    Open Builder
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                  </button>
                  <button
                    onClick={() => setConfirmId(wf._id)}
                    disabled={deletingId === wf._id}
                    title="Delete workflow"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 active:scale-95 transition-all duration-150 disabled:opacity-40"
                  >
                    {deletingId === wf._id
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-up">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5 animate-scale-in">
            <div className="flex items-start gap-3 mb-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-heading">Delete workflow?</p>
                <p className="text-xs text-body-light mt-1 leading-relaxed">
                  <strong className="text-heading font-medium">
                    "{workflows.find((w) => w._id === confirmId)?.name}"
                  </strong>{" "}
                  will be permanently deleted. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-body hover:bg-gray-50 active:scale-95 transition-all duration-150"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmId)}
                disabled={deletingId === confirmId}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 active:scale-95 transition-all duration-150"
              >
                {deletingId === confirmId && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
