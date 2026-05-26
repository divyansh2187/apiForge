import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const payload = mode === "login" ? { email: form.email, password: form.password } : form;
      const { data } = await api.post(endpoint, payload);
      login(data);
      toast.success(mode === "login" ? "Welcome back!" : "Account created!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-animated flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, #0ea5e9, transparent)" }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass mb-4"
            style={{ boxShadow: "0 0 30px rgba(59,130,246,0.3)" }}>
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            API<span className="text-blue-400">Forge</span>
          </h1>
          <p className="text-glass-text-dim text-sm mt-1">Your personal API testing workspace</p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8">
          {/* Tabs */}
          <div className="flex glass rounded-2xl p-1 mb-6">
            {["login", "register"].map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  mode === m
                    ? "bg-blue-500 text-white shadow-lg"
                    : "text-glass-text-dim hover:text-white"
                }`}>
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs text-glass-text-dim mb-1.5 font-medium tracking-wide">FULL NAME</label>
                <input name="name" value={form.name} onChange={handle} placeholder="John Doe"
                  className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white placeholder-glass-muted" />
              </div>
            )}
            <div>
              <label className="block text-xs text-glass-text-dim mb-1.5 font-medium tracking-wide">EMAIL</label>
              <input name="email" type="email" value={form.email} onChange={handle} placeholder="dev@example.com"
                className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white placeholder-glass-muted" />
            </div>
            <div>
              <label className="block text-xs text-glass-text-dim mb-1.5 font-medium tracking-wide">PASSWORD</label>
              <input name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••"
                className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white placeholder-glass-muted" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 mt-2"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                boxShadow: "0 4px 20px rgba(59,130,246,0.4)"
              }}>
              {loading ? "Processing..." : mode === "login" ? "Sign In →" : "Create Account →"}
            </button>
          </form>
        </div>

        <div className="text-center mt-4 text-sm text-glass-text-dim">
          {mode === "login" ? "No account? " : "Have an account? "}
          <button onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            {mode === "login" ? "Register" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
