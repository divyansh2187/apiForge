import { useState } from "react";

const formatBytes = (b) => b < 1024 ? `${b} B` : `${(b / 1024).toFixed(1)} KB`;

const getStatusStyle = (s) => {
  if (!s) return { color: "rgba(240,244,255,0.25)", bg: "rgba(255,255,255,0.05)" };
  if (s < 300) return { color: "#4ade80", bg: "rgba(34,197,94,0.12)" };
  if (s < 400) return { color: "#fbbf24", bg: "rgba(251,191,36,0.12)" };
  if (s < 500) return { color: "#fb923c", bg: "rgba(251,146,60,0.12)" };
  return { color: "#f87171", bg: "rgba(248,113,113,0.12)" };
};

const JsonHighlight = ({ text }) => {
  const lines = text.split("\n");
  return (
    <div className="font-mono text-xs leading-5">
      {lines.map((line, i) => {
        const hl = line
          .replace(/("(?:[^"\\]|\\.)*")(\s*:)/g, '<span style="color:#93c5fd">$1</span>$2')
          .replace(/:\s*("(?:[^"\\]|\\.)*")/g, ': <span style="color:#86efac">$1</span>')
          .replace(/:\s*(\d+\.?\d*)/g, ': <span style="color:#f9a8d4">$1</span>')
          .replace(/:\s*(true|false|null)/g, ': <span style="color:#fde68a">$1</span>');
        return (
          <div key={i} className="flex hover:bg-white hover:bg-opacity-5 rounded px-1">
            <span className="select-none text-glass-muted w-8 shrink-0 text-right pr-3 text-xs">{i + 1}</span>
            <span dangerouslySetInnerHTML={{ __html: hl }} className="text-glass-text" />
          </div>
        );
      })}
    </div>
  );
};

export default function ResponseViewer({ response }) {
  const [tab, setTab] = useState("body");

  if (!response) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-glass-muted p-6">
        <div className="w-20 h-20 rounded-3xl glass flex items-center justify-center text-3xl mb-5 opacity-60">
          ⚡
        </div>
        <div className="text-sm font-medium text-glass-text-dim mb-1">Send a request</div>
        <div className="text-xs text-glass-muted text-center">Enter a URL and press Send<br/>or hit Enter</div>
      </div>
    );
  }

  if (response.error) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="rounded-2xl p-6 text-center max-w-sm w-full"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <div className="text-red-400 text-3xl mb-3">⚠</div>
          <div className="text-red-400 text-sm font-semibold mb-2">Request Failed</div>
          <div className="text-glass-text-dim text-xs leading-relaxed">{response.message}</div>
          {response.time && <div className="text-glass-muted text-xs mt-3">{response.time}ms</div>}
        </div>
      </div>
    );
  }

  let isJson = false;
  let displayBody = response.body || "";
  try { JSON.parse(response.body); isJson = true; displayBody = JSON.stringify(JSON.parse(response.body), null, 2); } catch {}

  const statusStyle = getStatusStyle(response.status);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Status bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold"
          style={{ background: statusStyle.bg, color: statusStyle.color }}>
          {response.status} {response.statusText}
        </div>
        <div className="flex items-center gap-1 text-xs text-glass-text-dim px-2 py-1 rounded-lg"
          style={{ background: "rgba(255,255,255,0.05)" }}>
          ⏱ {response.time}ms
        </div>
        <div className="flex items-center gap-1 text-xs text-glass-text-dim px-2 py-1 rounded-lg"
          style={{ background: "rgba(255,255,255,0.05)" }}>
          ↕ {formatBytes(response.size || 0)}
        </div>
        <div className="ml-auto">
          <button onClick={() => { navigator.clipboard.writeText(displayBody); }}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors px-3 py-1.5 rounded-lg"
            style={{ background: "rgba(59,130,246,0.1)" }}>
            Copy
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 gap-1 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        {["body", "headers"].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              tab === t ? "text-white" : "text-glass-text-dim hover:text-white"
            }`}
            style={tab === t ? { background: "rgba(59,130,246,0.2)", border: "1px solid rgba(59,130,246,0.3)" } : {}}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {tab === "body" && (
          isJson ? <JsonHighlight text={displayBody} /> : <pre className="text-xs text-glass-text font-mono">{displayBody}</pre>
        )}
        {tab === "headers" && (
          <div className="space-y-1">
            {Object.entries(response.headers || {}).map(([k, v]) => (
              <div key={k} className="flex gap-3 py-2 px-3 rounded-xl text-xs hover:bg-white hover:bg-opacity-5 transition-colors">
                <span className="text-blue-300 shrink-0 font-medium w-40 truncate">{k}</span>
                <span className="text-glass-text-dim break-all">{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
