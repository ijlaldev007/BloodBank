import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { auth, db } from "./firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { User } from "firebase/auth";

// Import Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import DonorDashboard from "./pages/DonorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import Matches from "./pages/Matches";

//import SeedDonors from "./components/SeedDonors";
// import SeedPatients from "./components/SeedPatients";


const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Checking authentication...");

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      console.log("User found:", currentUser.email);
      setUser(currentUser);

      // Agar role already hai toh dobara fetch na karo
      if (role) {
        setLoading(false);
        return;
      }

      try {
        // Firestore se role fetch karna
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setRole(userData.role);
          console.log("Role found:", userData.role);
        } else {
          console.log("No role found in database.");
          setRole(null);
        }
      } catch (error) {
        console.error("Error fetching role:", error);
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [role]); // ✅ Depend only on `role`, avoid infinite loop

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (

    <Router>

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

        {user && role === "admin" && (
          <Route path="/admin-matches" element={<Matches />} />
        )}



        {/* Default Redirect */}
        <Route path="*" element={<Navigate to={user ? `/${role}-dashboard` : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
