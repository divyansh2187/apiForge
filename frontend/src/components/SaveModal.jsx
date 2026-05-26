import { useState, useEffect } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function SaveModal({ request, onClose, onSaved }) {
  const [collections, setCollections] = useState([]);
  const [name, setName] = useState(request.name || "");
  const [collectionId, setCollectionId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/collections").then(({ data }) => {
      setCollections(data);
      if (data.length > 0) setCollectionId(data[0]._id);
    });
  }, []);

  const save = async () => {
    if (!name.trim()) return toast.error("Name required");
    if (!collectionId) return toast.error("Select a collection");
    setLoading(true);
    try {
      const { data } = await api.post("/requests", { ...request, name, collection: collectionId });
      toast.success("Saved!");
      onSaved(data);
      onClose();
    } catch { toast.error("Failed to save"); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
      <div className="glass-bright rounded-3xl p-6 w-full max-w-sm"
        style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)" }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm"
            style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}>💾</div>
          <div>
            <div className="text-white font-semibold text-sm">Save Request</div>
            <div className="text-glass-text-dim text-xs">Add to a collection</div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-glass-text-dim mb-1.5 font-medium">REQUEST NAME</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Get users list" autoFocus
              className="glass-input w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-glass-muted" />
          </div>
          <div>
            <label className="block text-xs text-glass-text-dim mb-1.5 font-medium">COLLECTION</label>
            <select value={collectionId} onChange={(e) => setCollectionId(e.target.value)}
              className="glass-input w-full rounded-xl px-4 py-2.5 text-sm text-white appearance-none">
              {collections.length === 0 && <option value="">Create a collection first</option>}
              {collections.map((c) => <option key={c._id} value={c._id} style={{ background: "#1a1a2e" }}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button onClick={save} disabled={loading || collections.length === 0}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", boxShadow: "0 4px 15px rgba(59,130,246,0.3)" }}>
            {loading ? "Saving..." : "Save →"}
          </button>
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm text-glass-text-dim transition-colors hover:text-white"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
