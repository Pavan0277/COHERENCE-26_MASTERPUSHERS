import { useState, useRef, useCallback } from "react";
import * as XLSX from "xlsx";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";
import { uploadLeads } from "../../services/api";
import { useWorkflow } from "../../store/workflowStore";

// ── Column synonyms ──────────────────────────────────────────────────────────
const COLUMN_SYNONYMS: Record<string, string[]> = {
  name: ["name", "full name", "fullname", "contact name", "lead name", "person"],
  email: ["email", "e-mail", "email address", "mail"],
  company: ["company", "organization", "organisation", "org", "employer", "business"],
  title: ["title", "job title", "role", "position", "designation", "job role"],
  phone: ["phone", "mobile", "tel", "telephone", "cell", "contact number", "phone number"],
};

function detectColumns(headers: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const header of headers) {
    const lower = header.toLowerCase().trim();
    for (const [field, synonyms] of Object.entries(COLUMN_SYNONYMS)) {
      if (!result[field] && synonyms.some((s) => lower.includes(s))) {
        result[field] = header;
      }
    }
  }
  return result;
}

interface ParsedPreview {
  headers: string[];
  rows: string[][];
  detectedColumns: Record<string, string>;
}

interface Props {
  workflowId: string | null;
  onClose: () => void;
}

export default function UploadPanel({ workflowId, onClose }: Props) {
  const { setDetectedColumns } = useWorkflow();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ParsedPreview | null>(null);
  const [status, setStatus] = useState<"idle" | "parsing" | "ready" | "loading" | "success" | "error">("idle");
  const [uploadResult, setUploadResult] = useState<{ count: number; detectedColumns: Record<string, string> } | null>(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // ── Parse file with SheetJS ──────────────────────────────────────────────
  const parseFile = useCallback((f: File) => {
    setFile(f);
    setStatus("parsing");
    setPreview(null);
    setError("");

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 }) as string[][];

        if (!rows.length) {
          setError("File is empty.");
          setStatus("error");
          return;
        }

        const headers = rows[0].map(String);
        const dataRows = rows.slice(1, 4).map((r) =>
          headers.map((_, i) => String(r[i] ?? ""))
        );
        const detectedColumns = detectColumns(headers);

        setPreview({ headers, rows: dataRows, detectedColumns });
        setStatus("ready");
      } catch {
        setError("Could not parse file. Make sure it is a valid CSV or Excel file.");
        setStatus("error");
      }
    };
    reader.readAsArrayBuffer(f);
  }, []);

  // ── Drag & drop handlers ─────────────────────────────────────────────────
  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) parseFile(dropped);
    },
    [parseFile]
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setStatus("idle");
    setError("");
    setUploadResult(null);
  };

  // ── Upload to backend ────────────────────────────────────────────────────
  const handleUpload = async () => {
    if (!file || !workflowId || !preview) return;
    setStatus("loading");
    try {
      const res = await uploadLeads(workflowId, file);
      const cols: Record<string, string> = res.data?.detectedColumns ?? preview.detectedColumns;
      const count: number = res.data?.leads?.length ?? 0;

      setDetectedColumns(cols);
      setUploadResult({ count, detectedColumns: cols });
      setStatus("success");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Upload failed";
      setError(msg);
      setStatus("error");
    }
  };

  const FIELD_COLORS: Record<string, string> = {
    name: "bg-blue-100 text-blue-700",
    email: "bg-purple-100 text-purple-700",
    company: "bg-yellow-100 text-yellow-700",
    title: "bg-green-100 text-green-700",
    phone: "bg-orange-100 text-orange-700",
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      {!file ? (
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition ${
            isDragging
              ? "border-blue-400 bg-blue-100"
              : "border-blue-200 bg-blue-50 hover:border-blue-400"
          }`}
        >
          <FileSpreadsheet className="mb-2 h-8 w-8 text-blue-400" />
          <p className="text-sm font-medium text-gray-600">
            {isDragging ? "Drop it here!" : "Drag & drop or click to select"}
          </p>
          <p className="mt-1 text-xs text-gray-400">.csv, .xls, .xlsx · Max 10 MB</p>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".csv,.xls,.xlsx"
            onChange={(e) => e.target.files?.[0] && parseFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2">
          <FileSpreadsheet className="h-4 w-4 shrink-0 text-blue-500" />
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-blue-800">
            {file.name}
          </span>
          <button onClick={clearFile} className="rounded p-0.5 hover:bg-blue-100">
            <X className="h-4 w-4 text-blue-400" />
          </button>
        </div>
      )}

      {/* Parsing spinner */}
      {status === "parsing" && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Parsing file…
        </div>
      )}

      {/* Column detection */}
      {preview && status !== "success" && (
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Detected columns
          </p>
          {Object.keys(preview.detectedColumns).length === 0 ? (
            <p className="text-xs text-amber-600">
              ⚠ No standard columns detected. Columns will be imported as-is.
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(preview.detectedColumns).map(([field, col]) => (
                <span
                  key={field}
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${FIELD_COLORS[field] ?? "bg-gray-100 text-gray-700"}`}
                >
                  {field} ← "{col}"
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Row preview table */}
      {preview && status !== "success" && preview.rows.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Preview (first {preview.rows.length} rows)
          </p>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  {preview.headers.map((h) => {
                    const matchedField = Object.entries(preview.detectedColumns).find(
                      ([, v]) => v === h
                    )?.[0];
                    return (
                      <th
                        key={h}
                        className="border-b border-gray-200 px-2 py-1.5 text-left font-semibold text-gray-600 whitespace-nowrap"
                      >
                        {h}
                        {matchedField && (
                          <span
                            className={`ml-1 rounded px-1 py-0.5 text-[10px] font-bold ${FIELD_COLORS[matchedField] ?? ""}`}
                          >
                            {matchedField}
                          </span>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {preview.rows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className="border-b border-gray-100 px-2 py-1.5 text-gray-600 whitespace-nowrap max-w-[100px] truncate"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Save-first warning */}
      {!workflowId && (
        <p className="text-xs text-amber-600">⚠ Save the workflow first to upload leads.</p>
      )}

      {/* Success */}
      {status === "success" && uploadResult && (
        <div className="rounded-lg bg-green-50 p-3 text-sm">
          <div className="flex items-center gap-2 font-medium text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            {uploadResult.count} leads imported successfully
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {Object.entries(uploadResult.detectedColumns).map(([field, col]) => (
              <span
                key={field}
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${FIELD_COLORS[field] ?? "bg-gray-100 text-gray-700"}`}
              >
                {field} ← "{col}"
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleUpload}
          disabled={status !== "ready" || !workflowId}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {status === "loading" ? "Uploading…" : "Upload to Backend"}
        </button>
        <button
          onClick={onClose}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition"
        >
          {status === "success" ? "Close" : "Cancel"}
        </button>
      </div>
    </div>
  );
}
