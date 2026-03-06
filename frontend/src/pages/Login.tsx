import React, { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import AuthLayout from "../components/auth/AuthLayout";
import InputField from "../components/auth/InputField";
import SocialButtons from "../components/auth/SocialButtons";
import SignInIllustration from "../components/auth/illustrations/SignInIllustration";

const MailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    width="16"
    height="16"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!form.email.trim() || !form.password.trim()) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    try {
      const res = await loginUser(form);
      if (rememberMe) localStorage.setItem("rememberMe", "true");
      localStorage.setItem("accessToken", res.data.accessToken);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout illustration={<SignInIllustration />} pageLabel="Sign In">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
          Welcome to our Velo.<br />
          Sign In to see latest updates.
        </h1>
        <p className="text-xs text-gray-400 mb-8">Enter your details to proceed further</p>

        {error && (
          <div className="mb-5 text-xs text-red-500 bg-red-50 px-3 py-2.5 rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Email"
            name="email"
            type="email"
            placeholder="john.doe@gmail.com"
            value={form.email}
            onChange={handleChange}
            icon={<MailIcon />}
          />
          <InputField
            label="Password"
            name="password"
            placeholder="Start typing..."
            value={form.password}
            onChange={handleChange}
            isPassword
          />

          {/* Remember me + Recover */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <div className="relative flex-shrink-0">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={[
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                    rememberMe ? "border-[#4361EE] bg-[#4361EE]" : "border-gray-300 bg-white",
                  ].join(" ")}
                >
                  {rememberMe && (
                    <svg viewBox="0 0 10 10" width="7" height="7" fill="white">
                      <circle cx="5" cy="5" r="3" />
                    </svg>
                  )}
                </span>
              </div>
              <span className="text-xs text-gray-600">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-[#4361EE] hover:underline"
            >
              Recover password
            </Link>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-[#1e3a5f] text-white text-sm font-semibold rounded-full hover:bg-[#16304f] transition-colors disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
            <Link
              to="/register"
              className="flex-1 py-2.5 bg-[#eef2ff] text-[#4361EE] text-sm font-semibold rounded-full hover:bg-[#e0e7ff] transition-colors text-center"
            >
              Sign Up
            </Link>
          </div>
        </form>

        <div className="mt-8">
          <SocialButtons />
        </div>
      </div>
    </AuthLayout>
  );
}
