import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";

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
import {
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Users,
  ShoppingCart,
  BarChart3,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  { label: "Profile", path: "/profile", icon: User },
  { label: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar() {
  const navigate = useNavigate();

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
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700">
          <span className="text-sm font-bold text-white">V</span>
        </div>
        <span className="text-lg font-bold tracking-tight text-heading">Velo</span>
        <span className="ml-auto truncate max-w-[100px] rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-600">
          {getUserName()}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-ultra-wide text-body-light">
          Menu
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-body hover:bg-gray-200 hover:text-heading"
              }`
            }
          >
            <item.icon className="h-[18px] w-[18px]" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-200 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-body transition-all duration-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Logout
        </button>
      </div>
    </aside>
  );
}
