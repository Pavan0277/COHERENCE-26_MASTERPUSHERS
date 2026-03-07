import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  GitBranch,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const STORAGE_KEY = "main-sidebar-collapsed";

function getUserName(): string {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return "User";
    const user = JSON.parse(raw);
    return user?.fullName || user?.email?.split("@")[0] || "User";
  } catch {
    return "User";
  }
}

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Workflows", path: "/workflows/new", icon: GitBranch },
  { label: "Calls",     path: "/calls",          icon: Phone },
  { label: "Settings",  path: "/settings",        icon: Settings },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState<boolean>(
    () => localStorage.getItem(STORAGE_KEY) === "true"
  );

  const toggle = () => {
    setCollapsed((prev) => {
      localStorage.setItem(STORAGE_KEY, String(!prev));
      return !prev;
    });
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // ignore
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside
      className={`flex h-screen shrink-0 flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
        collapsed ? "w-[60px]" : "w-64"
      }`}
    >
      {/* Logo row + collapse toggle */}
      <div className="flex h-16 items-center border-b border-gray-200 px-3">
        {!collapsed && (
          <>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700">
              <span className="text-sm font-bold text-white">V</span>
            </div>
            <span className="ml-2 text-lg font-bold tracking-tight text-heading">Velo</span>
            <span className="ml-auto truncate max-w-[80px] rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-600">
              {getUserName()}
            </span>
          </>
        )}
        {collapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700">
            <span className="text-sm font-bold text-white">V</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-2 py-3">
        {!collapsed && (
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-ultra-wide text-body-light">
            Menu
          </p>
        )}
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                collapsed ? "justify-center px-0" : ""
              } ${
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-body hover:bg-gray-100 hover:text-heading"
              }`
            }
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && item.label}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle button */}
      <div className="border-t border-gray-100 px-2 py-2">
        <button
          onClick={toggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-body transition-all duration-200 hover:bg-gray-100 hover:text-heading ${
            collapsed ? "justify-center px-0" : ""
          }`}
        >
          {collapsed ? (
            <ChevronRight className="h-[18px] w-[18px] shrink-0" />
          ) : (
            <>
              <ChevronLeft className="h-[18px] w-[18px] shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* Logout */}
      <div className="border-t border-gray-200 px-2 py-2">
        <button
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-body transition-all duration-200 hover:bg-red-50 hover:text-red-600 ${
            collapsed ? "justify-center px-0" : ""
          }`}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}
