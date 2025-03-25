import React from "react";
import { NavLink } from "react-router-dom";

import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    // ListItemSuffix, Chip, // Only import these if you need them
} from "@material-tailwind/react";

import {
    PresentationChartBarIcon,
    InboxIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    PowerIcon,
} from "@heroicons/react/24/solid";

interface SidebarProps {
    onAddDonor?: () => void; // Made optional
}

const Sidebar: React.FC<SidebarProps> = ({ onAddDonor }) => {
    return (
        <Card
            className="h-screen w-[10rem]  p-3 shadow-xl shadow-blue-gray-900/5"
            variant="gradient"
            placeholder=""
            onPointerEnterCapture={() => { }}
            onPointerLeaveCapture={() => { }}
        >
            <div className="mb-2 p-2">
                <Typography variant="h5" color="blue-gray"
                    placeholder=""
                    onPointerEnterCapture={() => { }}
                    onPointerLeaveCapture={() => { }}>
                    Admin Panel
                </Typography>
            </div>
            <List placeholder=""
                onPointerEnterCapture={() => { }}
                onPointerLeaveCapture={() => { }}>
                <ListItem
                    placeholder=""
                    onPointerEnterCapture={() => { }}
                    onPointerLeaveCapture={() => { }}>
                    <ListItemPrefix
                        placeholder=""
                        onPointerEnterCapture={() => { }}
                        onPointerLeaveCapture={() => { }}>
                        <PresentationChartBarIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    <NavLink
                        to="/admin-dashboard"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 text-lg hover:bg-gray-700 transition ${isActive ? "bg-gray-700" : ""
                            }`
                        }
                    >
                        Dashboard
                    </NavLink>
                </ListItem>

                <ListItem
                    placeholder=""
                    onPointerEnterCapture={() => { }}
                    onPointerLeaveCapture={() => { }}>
                    <ListItemPrefix
                        placeholder=""
                        onPointerEnterCapture={() => { }}
                        onPointerLeaveCapture={() => { }}>
                        <InboxIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    <NavLink
                        to="/patient-dashboard"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 text-lg hover:bg-gray-700 transition ${isActive ? "bg-gray-700" : ""
                            }`
                        }
                    >
                        Patients
                    </NavLink>
                </ListItem>

                <ListItem
                    placeholder=""
                    onPointerEnterCapture={() => { }}
                    onPointerLeaveCapture={() => { }}>
                    <ListItemPrefix
                        placeholder=""
                        onPointerEnterCapture={() => { }}
                        onPointerLeaveCapture={() => { }}>
                        <UserCircleIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    <NavLink
                        to="/admin-matches"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 text-lg hover:bg-gray-700 transition ${isActive ? "bg-gray-700" : ""
                            }`
                        }
                    >
                        Matches
                    </NavLink>
                </ListItem>

                <ListItem placeholder=""
                    onPointerEnterCapture={() => { }}
                    onPointerLeaveCapture={() => { }}>
                    <ListItemPrefix placeholder=""
                        onPointerEnterCapture={() => { }}
                        onPointerLeaveCapture={() => { }}>
                        <Cog6ToothIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 text-lg hover:bg-gray-700 transition ${isActive ? "bg-gray-700" : ""
                            }`
                        }
                    >
                        Settings
                    </NavLink>
                </ListItem>

                <ListItem placeholder=""
                    onPointerEnterCapture={() => { }}
                    onPointerLeaveCapture={() => { }}>
                    <ListItemPrefix placeholder=""
                        onPointerEnterCapture={() => { }}
                        onPointerLeaveCapture={() => { }}>
                        <PowerIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    <NavLink
                        to="/logout"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 text-lg hover:bg-gray-700 transition ${isActive ? "bg-gray-700" : ""
                            }`
                        }
                    >
                        Log Out
                    </NavLink>
                </ListItem>
            </List>
        </Card>
    );
};

export default Sidebar;
