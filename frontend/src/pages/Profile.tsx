import { Mail, User, Calendar, Hash } from "lucide-react";
import { Link } from "react-router-dom";

interface StoredUser {
  _id?: string;
  fullName?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

function getStoredUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

function getInitials(fullName?: string, email?: string): string {
  if (fullName?.trim()) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      const last = parts.at(-1)?.[0] ?? "";
      return (parts[0][0] + last).toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  }
  if (email?.trim()) {
    return email.slice(0, 2).toUpperCase();
  }
  return "?";
}

function formatDate(iso?: string): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function Profile() {
  const user = getStoredUser();

  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-heading">Profile</h1>
        <div className="rounded-xl border border-gray-200 bg-gray-100 p-8 shadow-card">
          <p className="text-body">No profile data found. Please log in again.</p>
          <Link
            to="/login"
            className="mt-4 inline-block text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            Go to Login →
          </Link>
        </div>
      </div>
    );
  }

  const initials = getInitials(user.fullName, user.email);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-heading">Profile</h1>
        <p className="text-sm text-body-light">Your account information</p>
      </div>

      {/* Profile Card */}
      <div className="rounded-xl border border-gray-200 bg-gray-100 p-6 shadow-card">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-2xl font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold text-heading truncate">
              {user.fullName || "—"}
            </h2>
            <p className="mt-1 flex items-center gap-2 text-sm text-body-light">
              <Mail className="h-4 w-4 shrink-0" />
              {user.email || "—"}
            </p>
            <p className="mt-2 flex items-center gap-2 text-xs text-body-light">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              Member since {formatDate(user.createdAt)}
            </p>
          </div>
          <Link
            to="/settings"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-heading transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Account Details */}
      <div className="rounded-xl border border-gray-200 bg-gray-100 shadow-card">
        <div className="border-b border-gray-200 px-5 py-4">
          <h3 className="text-base font-semibold text-heading">Account Details</h3>
          <p className="text-xs text-body-light">Your profile information</p>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-brand-50 p-2.5">
                <User className="h-4 w-4 text-brand-600" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-body-light">
                  Full Name
                </p>
                <p className="text-sm font-medium text-heading">
                  {user.fullName || "—"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-brand-50 p-2.5">
                <Mail className="h-4 w-4 text-brand-600" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-body-light">
                  Email Address
                </p>
                <p className="text-sm font-medium text-heading">
                  {user.email || "—"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-brand-50 p-2.5">
                <Hash className="h-4 w-4 text-brand-600" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-body-light">
                  User ID
                </p>
                <p className="font-mono text-sm text-heading truncate max-w-[200px] sm:max-w-none" title={user._id}>
                  {user._id || "—"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-brand-50 p-2.5">
                <Calendar className="h-4 w-4 text-brand-600" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-body-light">
                  Joined
                </p>
                <p className="text-sm font-medium text-heading">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
