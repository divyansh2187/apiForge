import { useState } from "react";
import Sidebar from "../components/Sidebar";
import RequestBuilder from "../components/RequestBuilder";
import ResponseViewer from "../components/ResponseViewer";
import SaveModal from "../components/SaveModal";
import api from "../utils/api";
import toast from "react-hot-toast";

const DEFAULT_REQUEST = {
  method: "GET", url: "", headers: [], params: [], body: "", bodyType: "none", name: "",
};

export default function WorkspacePage() {
  const [request, setRequest] = useState(DEFAULT_REQUEST);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sendRequest = async () => {
    if (!request.url.trim()) return toast.error("Enter a URL first");
    setLoading(true);
    setResponse(null);
    try {
      const { data } = await api.post("/proxy", request);
      setResponse(data);
    } catch (err) {
      toast.error("Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  const loadRequest = (req) => {
    setRequest({
      method: req.method || "GET",
      url: req.url || "",
      headers: req.headers || [],
      params: req.params || [],
      body: req.body || "",
      bodyType: req.bodyType || "none",
      name: req.name || "",
      _id: req._id,
    });
    // Restore saved response if from history
    if (req._historyResponse) {
      setResponse(req._historyResponse);
    } else {
      setResponse(null);
    }
    toast.success(`Loaded: ${req.name || req.url}`);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-animated relative">
      {/* Background orbs */}
      <div className="fixed top-0 left-1/3 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
      <div className="fixed bottom-0 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />

      {/* Sidebar */}
      {sidebarOpen && <Sidebar onLoadRequest={loadRequest} />}

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)"
          }}>
          <button onClick={() => setSidebarOpen(v => !v)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-glass-text-dim hover:text-white transition-all"
            style={{ background: "rgba(255,255,255,0.06)" }}>
            ☰
          </button>

          <div className="flex-1" />

          <button onClick={() => { setRequest(DEFAULT_REQUEST); setResponse(null); }}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors px-3 py-1.5 rounded-lg flex items-center gap-1"
            style={{ background: "rgba(59,130,246,0.08)" }}>
            + New
          </button>

          {request.url && (
            <button onClick={() => setShowSave(true)}
              className="text-xs text-white font-medium px-4 py-1.5 rounded-lg transition-all"
              style={{ background: "rgba(59,130,246,0.2)", border: "1px solid rgba(59,130,246,0.3)" }}>
              Save
            </button>
          )}
        </div>

        {/* Split panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Request panel */}
          <div className="flex flex-col overflow-hidden"
            style={{ width: "50%", borderRight: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="px-4 py-2 border-b flex items-center gap-2"
              style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
              <span className="text-xs font-medium text-glass-text-dim tracking-wider">REQUEST</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <RequestBuilder request={request} onChange={setRequest} onSend={sendRequest} loading={loading} />
            </div>
          </div>

          {/* Response panel */}
          <div className="flex flex-col overflow-hidden" style={{ width: "50%" }}>
            <div className="px-4 py-2 border-b flex items-center gap-2"
              style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
              <span className="text-xs font-medium text-glass-text-dim tracking-wider">RESPONSE</span>
            </div>
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-blue-400 text-xl mx-auto mb-3 animate-pulse">
                    ⚡
                  </div>
                  <div className="text-xs text-glass-text-dim">Sending request...</div>
                </div>
              </div>
            ) : (
              <ResponseViewer response={response} />
            )}
          </div>
        </div>
      </div>

      {showSave && (
        <SaveModal request={request} onClose={() => setShowSave(false)}
          onSaved={(saved) => setRequest({ ...request, _id: saved._id, name: saved.name })} />
      )}
    </div>
  );
}
