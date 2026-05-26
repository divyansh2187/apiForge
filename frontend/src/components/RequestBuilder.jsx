import { useState } from "react";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const METHOD_STYLES = {
  GET:    { color: "#4ade80", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.3)" },
  POST:   { color: "#fb923c", bg: "rgba(251,146,60,0.1)",  border: "rgba(251,146,60,0.3)" },
  PUT:    { color: "#60a5fa", bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.3)" },
  PATCH:  { color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.3)" },
  DELETE: { color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)" },
};

const KVEditor = ({ rows, onChange, placeholder = "Key" }) => {
  const addRow = () => onChange([...rows, { key: "", value: "", enabled: true }]);
  const updateRow = (i, field, val) => onChange(rows.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  const removeRow = (i) => onChange(rows.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-2">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input type="checkbox" checked={row.enabled !== false}
            onChange={(e) => updateRow(i, "enabled", e.target.checked)}
            className="accent-blue-500 shrink-0 w-3.5 h-3.5" />
          <input value={row.key} onChange={(e) => updateRow(i, "key", e.target.value)}
            placeholder={placeholder}
            className="glass-input flex-1 rounded-xl px-3 py-2 text-xs text-white placeholder-glass-muted font-mono" />
          <input value={row.value} onChange={(e) => updateRow(i, "value", e.target.value)}
            placeholder="Value"
            className="glass-input flex-1 rounded-xl px-3 py-2 text-xs text-white placeholder-glass-muted font-mono" />
          <button onClick={() => removeRow(i)} className="text-glass-muted hover:text-red-400 text-sm transition-colors px-1">✕</button>
        </div>
      ))}
      <button onClick={addRow}
        className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 mt-1">
        <span>+</span> Add row
      </button>
    </div>
  );
};

export default function RequestBuilder({ request, onChange, onSend, loading }) {
  const [tab, setTab] = useState("params");
  const [bodyType, setBodyType] = useState(request.bodyType || "none");

  const handleBodyType = (t) => { setBodyType(t); onChange({ ...request, bodyType: t }); };
  const ms = METHOD_STYLES[request.method] || METHOD_STYLES.GET;

  const activeCount = {
    params: (request.params || []).filter(p => p.key).length,
    headers: (request.headers || []).filter(h => h.key).length,
  };

  return (
    <div className="flex flex-col h-full">
      {/* URL Bar */}
      <div className="p-4 flex gap-2">
        <div className="relative">
          <select value={request.method}
            onChange={(e) => onChange({ ...request, method: e.target.value })}
            className="appearance-none rounded-xl px-3 py-2.5 text-xs font-bold cursor-pointer focus:outline-none pr-6"
            style={{ background: ms.bg, color: ms.color, border: `1px solid ${ms.border}` }}>
            {METHODS.map((m) => (
              <option key={m} value={m} style={{ background: "#1a1a2e", color: METHOD_STYLES[m].color }}>{m}</option>
            ))}
          </select>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs pointer-events-none" style={{ color: ms.color }}>▾</span>
        </div>

        <input value={request.url} onChange={(e) => onChange({ ...request, url: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="https://api.example.com/endpoint"
          className="glass-input flex-1 rounded-xl px-4 py-2.5 text-sm text-white placeholder-glass-muted font-mono" />

        <button onClick={onSend} disabled={loading || !request.url}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-40 whitespace-nowrap"
          style={{
            background: loading ? "rgba(59,130,246,0.5)" : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            boxShadow: loading ? "none" : "0 4px 15px rgba(59,130,246,0.35)"
          }}>
          {loading ? "..." : "Send"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex px-4 gap-1 pb-2">
        {["params", "headers", "body"].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
              tab === t ? "text-white" : "text-glass-text-dim hover:text-white"
            }`}
            style={tab === t ? { background: "rgba(59,130,246,0.2)", border: "1px solid rgba(59,130,246,0.3)" } : {}}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {activeCount[t] > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center" style={{ fontSize: "9px" }}>
                {activeCount[t]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {tab === "params" && (
          <KVEditor rows={request.params || []} onChange={(params) => onChange({ ...request, params })} placeholder="Parameter" />
        )}
        {tab === "headers" && (
          <KVEditor rows={request.headers || []} onChange={(headers) => onChange({ ...request, headers })} placeholder="Header" />
        )}
        {tab === "body" && (
          <div className="space-y-3">
            <div className="flex gap-1.5">
              {["none", "json", "raw"].map((bt) => (
                <button key={bt} onClick={() => handleBodyType(bt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    bodyType === bt ? "text-white" : "text-glass-text-dim hover:text-white"
                  }`}
                  style={bodyType === bt ? { background: "rgba(59,130,246,0.2)", border: "1px solid rgba(59,130,246,0.3)" } : { border: "1px solid rgba(255,255,255,0.08)" }}>
                  {bt}
                </button>
              ))}
            </div>
            {(bodyType === "json" || bodyType === "raw") && (
              <textarea value={request.body || ""} onChange={(e) => onChange({ ...request, body: e.target.value })}
                placeholder={bodyType === "json" ? '{\n  "key": "value"\n}' : "Raw body..."}
                rows={12}
                className="glass-input w-full rounded-xl px-4 py-3 text-xs text-white placeholder-glass-muted font-mono resize-none" />
            )}
            {bodyType === "none" && (
              <div className="text-center py-8 text-glass-muted text-xs">
                <div className="text-2xl mb-2 opacity-40">📭</div>
                Select json or raw to add a body
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
