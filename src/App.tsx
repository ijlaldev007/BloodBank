import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // Global auth state
// Import Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import DonorDashboard from "./pages/DonorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import Matches from "./pages/Matches";

const AppRoutes: React.FC = () => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

      {/* Role-Based Private Routes */}
      {user && role === "admin" && <Route path="/admin-dashboard" element={<AdminDashboard />} />}
      {user && role === "donor" && <Route path="/donor-dashboard" element={<DonorDashboard />} />}
      {user && (role === "patient" || role === "admin") && (
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
      )}
      {user && role === "admin" && <Route path="/admin-matches" element={<Matches />} />}

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to={user ? `/${role}-dashboard` : "/login"} />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
