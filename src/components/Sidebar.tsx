import React from "react";
import { NavLink } from "react-router-dom";





interface SidebarProps {
    onAddDonor?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddDonor }) => {
    return (
        <aside className="w-48 h-screen bg-gray-800 text-white shadow-lg fixed">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-center text-white">
                    Admin Panel
                </h2>
            </div>
            <nav className="mt-6">
                <ul className="space-y-4">
                    <li>
                        <NavLink
                            to="/admin-dashboard"
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-6 py-3 text-lg hover:bg-gray-700 transition ${isActive ? "bg-gray-700" : ""
                                }`
                            }
                        >
                            
                            Dashboard
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/patient-dashboard"  // Update route from "/admin-patients" to "/patient-dashboard"
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-6 py-3 text-lg hover:bg-gray-700 transition ${isActive ? "bg-gray-700" : ""
                                }`
                            }
                        >
                            
                            Patients
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/admin-matches"
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-6 py-3 text-lg hover:bg-gray-700 transition ${isActive ? "bg-gray-700" : ""}`
                            }
                        >
                            
                            Matches
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;  