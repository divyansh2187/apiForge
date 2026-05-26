import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import WorkspacePage from "./pages/WorkspacePage";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-animated">
      <div className="text-center">
        <div className="w-16 h-16 rounded-3xl glass flex items-center justify-center text-2xl mx-auto mb-3 animate-pulse"
          style={{ boxShadow: "0 0 30px rgba(59,130,246,0.3)" }}>⚡</div>
        <div className="text-white font-semibold">APIForge</div>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/auth" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: {
            background: "rgba(20,20,40,0.9)",
            backdropFilter: "blur(20px)",
            color: "#f0f4ff",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "12px",
            fontSize: "13px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          },
        }} />
        <Routes>
          <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
          <Route path="/" element={<PrivateRoute><WorkspacePage /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
