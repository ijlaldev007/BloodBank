import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";  // ✅ Correct Named Import
import PropTypes from "prop-types";

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login");
    };

    return (
        <header className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg py-4 px-6 flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold tracking-wide">
                Blood Donor Admin
            </h1>

            <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300 shadow-md"
            >
                <FaSignOutAlt size={18} />
                <span>Logout</span>
            </button>
        </header>
    );
}

export default Header;
