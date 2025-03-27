import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";


import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";

const Header = () => {
    const navigate = useNavigate();
    const { user, role } = useAuth();

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login");
    };

    return (
        // Update the header to:
        <header className="sticky top-0 z-10 bg-white shadow-md py-4 px-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-red-600">
                <span className="hidden md:inline">Blood Donation</span> Management
            </h1>

            <div className="flex items-center gap-4">
                <span className="text-gray-600">{user?.email}</span>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
}

export default Header;
