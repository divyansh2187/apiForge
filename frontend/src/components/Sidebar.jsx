import { useState, useEffect } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const COLORS = ["#3b82f6","#22c55e","#a855f7","#ef4444","#f59e0b","#06b6d4","#ec4899"];

const getStatusClass = (s) => {
  if (!s) return "text-glass-muted";
  if (s < 300) return "text-green-400";
  if (s < 400) return "text-yellow-400";
  if (s < 500) return "text-orange-400";
  return "text-red-400";
};

export default function Sidebar({ onLoadRequest }) {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("collections");
  const [collections, setCollections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [expandedCols, setExpandedCols] = useState({});
  const [showNewCol, setShowNewCol] = useState(false);
  const [newColName, setNewColName] = useState("");
  const [newColColor, setNewColColor] = useState(COLORS[0]);

  useEffect(() => { fetchCollections(); }, []);
  useEffect(() => { if (tab === "history") fetchHistory(); }, [tab]);

  const fetchCollections = async () => {
    const [colRes, reqRes] = await Promise.all([
      api.get("/collections"),
      api.get("/requests"),
    ]);
    setCollections(colRes.data);
    setRequests(reqRes.data);
  };

  const fetchHistory = async () => {
    const { data } = await api.get("/proxy/history");
    setHistory(data);
  };

  const createCollection = async () => {
    if (!newColName.trim()) return;
    try {
      const { data } = await api.post("/collections", { name: newColName, color: newColColor });
      setCollections([data, ...collections]);
      setNewColName(""); setShowNewCol(false);
      toast.success("Collection created");
    } catch { toast.error("Failed to create collection"); }
  };

  const deleteCollection = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this collection?")) return;
    await api.delete(`/collections/${id}`);
    setCollections(collections.filter(c => c._id !== id));
    setRequests(requests.filter(r => r.collection !== id));
    toast.success("Deleted");
  };

  const deleteRequest = async (id, e) => {
    e.stopPropagation();
    await api.delete(`/requests/${id}`);
    setRequests(requests.filter(r => r._id !== id));
    toast.success("Deleted");
  };

  const clearHistory = async () => {
    if (!confirm("Clear all history?")) return;
    await api.delete("/proxy/history");
    setHistory([]);
    toast.success("History cleared");
  };

  const toggleCol = (id) => setExpandedCols(p => ({ ...p, [id]: !p[id] }));

  return (
    <div className="w-64 flex-shrink-0 flex flex-col h-full glass border-r-0 rounded-none"
      style={{ borderRight: "1px solid rgba(255,255,255,0.08)" }}>

      {/* Header */}
      <div className="p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
            style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", boxShadow: "0 0 12px rgba(59,130,246,0.4)" }}>
            ⚡
          </div>
          <div>
            <div className="text-white font-semibold text-sm">APIForge</div>
            <div className="text-glass-text-dim text-xs truncate max-w-[140px]">{user?.email}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-2 gap-1 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        {["collections", "history"].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              tab === t
                ? "text-white"
                : "text-glass-text-dim hover:text-white"
            }`}
            style={tab === t ? {
              background: "rgba(59,130,246,0.2)",
              border: "1px solid rgba(59,130,246,0.3)"
            } : {}}>
            {t === "collections" ? "Saved" : "History"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2">
        {tab === "collections" && (
          <>
            <button onClick={() => setShowNewCol(true)}
              className="w-full text-left px-3 py-2 rounded-xl text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5 mb-1 group"
              style={{ background: "rgba(59,130,246,0.08)" }}>
              <span className="text-base leading-none">+</span>
              <span className="font-medium">New Collection</span>
            </button>

            {showNewCol && (
              <div className="glass-bright rounded-2xl p-3 mb-2 space-y-2">
                <input value={newColName} onChange={(e) => setNewColName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && createCollection()}
                  placeholder="Collection name" autoFocus
                  className="glass-input w-full rounded-xl px-3 py-2 text-xs text-white placeholder-glass-muted" />
                <div className="flex gap-1.5 flex-wrap">
                  {COLORS.map((c) => (
                    <button key={c} onClick={() => setNewColColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-4 h-4 rounded-full border-2 transition-transform ${newColColor === c ? "border-white scale-125" : "border-transparent"}`} />
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <button onClick={createCollection}
                    className="flex-1 py-1.5 rounded-lg text-xs text-white font-medium"
                    style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}>
                    Create
                  </button>
                  <button onClick={() => setShowNewCol(false)}
                    className="flex-1 py-1.5 rounded-lg text-xs text-glass-text-dim"
                    style={{ background: "rgba(255,255,255,0.06)" }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {collections.map((col) => {
              const colRequests = requests.filter((r) => r.collection === col._id);
              const isOpen = expandedCols[col._id];
              return (
                <div key={col._id} className="mb-1">
                  <div onClick={() => toggleCol(col._id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer group transition-all"
                    style={{ background: isOpen ? "rgba(255,255,255,0.06)" : "transparent" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                    onMouseLeave={e => e.currentTarget.style.background = isOpen ? "rgba(255,255,255,0.06)" : "transparent"}>
                    <span className="text-xs transition-transform duration-200" style={{ color: col.color, display: "inline-block", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: col.color }} />
                    <span className="text-xs text-white flex-1 truncate font-medium">{col.name}</span>
                    <span className="text-xs text-glass-muted">{colRequests.length}</span>
                    <button onClick={(e) => deleteCollection(col._id, e)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 text-xs px-0.5 transition-opacity">✕</button>
                  </div>

                  {isOpen && (
                    <div className="ml-2 mt-0.5 space-y-0.5">
                      {colRequests.length === 0 && (
                        <div className="text-xs text-glass-muted py-2 px-3">No requests yet</div>
                      )}
                      {colRequests.map((req) => (
                        <div key={req._id} onClick={() => onLoadRequest(req)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer group transition-all"
                          style={{ background: "transparent" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(59,130,246,0.1)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <span className={`text-xs font-bold shrink-0 text-${req.method}`}
                            style={{ fontSize: "10px", minWidth: "36px" }}>
                            {req.method}
                          </span>
                          <span className="text-xs text-glass-text-dim flex-1 truncate">{req.name}</span>
                          <button onClick={(e) => deleteRequest(req._id, e)}
                            className="opacity-0 group-hover:opacity-100 text-red-400 text-xs transition-opacity">✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {collections.length === 0 && !showNewCol && (
              <div className="text-center py-10 text-glass-muted text-xs">
                <div className="text-2xl mb-2 opacity-40">📁</div>
                No collections yet
              </div>
            )}
          </>
        )}

        {tab === "history" && (
          <>
            {history.length > 0 && (
              <button onClick={clearHistory}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 mb-1 transition-colors flex items-center gap-1.5"
                style={{ background: "rgba(239,68,68,0.08)" }}>
                ✕ Clear History
              </button>
            )}
            {history.map((h) => (
              <div key={h._id}
                onClick={() => onLoadRequest({
                  method: h.method, url: h.url, headers: h.headers,
                  params: h.params, body: h.body, bodyType: h.bodyType,
                  name: h.url, _historyResponse: h.response,
                })}
                className="px-3 py-2.5 rounded-xl cursor-pointer mb-0.5 transition-all"
                style={{ background: "transparent" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(59,130,246,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-xs font-bold text-${h.method}`} style={{ fontSize: "10px", minWidth: "36px" }}>
                    {h.method}
                  </span>
                  {h.response?.status && (
                    <span className={`text-xs ${getStatusClass(h.response.status)}`}>
                      {h.response.status}
                    </span>
                  )}
                  {h.response?.time && (
                    <span className="text-xs text-glass-muted ml-auto">{h.response.time}ms</span>
                  )}
                </div>
                <div className="text-xs text-glass-text-dim truncate">{h.url}</div>
              </div>
            ))}
            {history.length === 0 && (
              <div className="text-center py-10 text-glass-muted text-xs">
                <div className="text-2xl mb-2 opacity-40">🕒</div>
                No history yet
              </div>
            )}
          </>
        )}
      </div>

      {/* Logout */}
      <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <button onClick={logout}
          className="w-full py-2 rounded-xl text-xs text-glass-text-dim hover:text-red-400 transition-colors"
          style={{ background: "rgba(255,255,255,0.04)" }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
