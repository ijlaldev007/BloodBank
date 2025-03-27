import React from 'react';
import { NavLink } from 'react-router-dom';
import { List, ListItem, ListItemText, ListItemIcon, Divider, Avatar, IconButton } from '@mui/material';
import {
  DashboardOutlined,
  PeopleAltOutlined,
  FavoriteBorderOutlined,
  AssignmentOutlined,
  SettingsOutlined,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';

interface SidebarProps {
  onAddDonor?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onAddDonor,
  isCollapsed = false,  // Default value
  onToggleCollapse = () => { }  // Default empty function
}) => {
  return (
    <div className={`fixed left-0 top-0 h-screen bg-white shadow-xl flex flex-col border-r border-gray-100 transition-all duration-300 ${isCollapsed ? 'w-[80px]' : 'w-[260px]'
      }`}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'invisible' : 'visible'}`}>
          <FavoriteBorderOutlined className="text-red-500 text-2xl" />
          <h1 className="text-xl font-bold text-gray-800">BloodConnect</h1>
        </div>
        <IconButton
          onClick={onToggleCollapse}
          className="!text-gray-600 hover:!bg-gray-100"
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </div>

      {/* Menu Items */}
      <div className="flex-1 px-2 py-4">
        <List className="space-y-1">
          <NavItem
            to="/admin-dashboard"
            icon={<DashboardOutlined />}
            label="Admin Dashboard"
            isCollapsed={isCollapsed}
          />
          <NavItem
            to="/donor-dashboard"
            icon={<PeopleAltOutlined />}
            label="Donor Management"
            isCollapsed={isCollapsed}
          />
          <NavItem
            to="/patient-dashboard"
            icon={<FavoriteBorderOutlined />}
            label="Patient Management"
            isCollapsed={isCollapsed}
          />
          <NavItem
            to="/admin-matches"
            icon={<AssignmentOutlined />}
            label="Matching System"
            isCollapsed={isCollapsed}
          />
          <Divider className="my-4" />
          <NavItem
            to="/settings"
            icon={<SettingsOutlined />}
            label="System Settings"
            isCollapsed={isCollapsed}
          />
        </List>
      </div>

      {/* Profile Section */}
      <div className="mt-auto p-4 border-t border-gray-100">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <Avatar className="w-10 h-10" src="path/to/your/profile.jpg" />
          {!isCollapsed && (
            <div>
              <p className="text-sm font-medium text-gray-800">David Oliva</p>
              <p className="text-xs text-gray-500">admin@bloodconnect.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactElement;
  label: string;
  isCollapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isCollapsed }) => (
  <ListItem className="!px-0">
    <NavLink
      to={to}
      className={({ isActive }: { isActive: boolean }) =>
        `flex items-center w-full p-3 rounded-lg transition-colors ${isActive ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'
        } ${isCollapsed ? 'justify-center' : 'px-4'}`
      }
    >
      <ListItemIcon className="!min-w-0">
        {React.cloneElement(icon, {
          className: ({ isActive }: { isActive: boolean }) =>
            `text-current ${isActive ? '!text-red-500' : ''}`
        })}
      </ListItemIcon>
      {!isCollapsed && (
        <ListItemText
          primary={label}
          primaryTypographyProps={{ className: 'font-medium text-sm' }}
        />
      )}
    </NavLink>
  </ListItem>
);

export default Sidebar;