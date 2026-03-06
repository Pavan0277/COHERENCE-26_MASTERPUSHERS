import React, { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import AuthLayout from "../components/auth/AuthLayout";
import InputField from "../components/auth/InputField";
import SocialButtons from "../components/auth/SocialButtons";
import SignUpIllustration from "../components/auth/illustrations/SignUpIllustration";

const PersonIcon = () => (
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
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

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

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim()
    ) {
      setError("All fields are required");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!agreed) {
      setError("Please accept the terms & conditions");
      return;
    }
    setLoading(true);
    try {
      const res = await registerUser({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("accessToken", res.data.accessToken);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout illustration={<SignUpIllustration />} pageLabel="Sign Up">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
          Welcome to Velo.<br />
          Sign Up to getting started.
        </h1>
        <p className="text-xs text-gray-400 mb-8">Enter your details to proceed further</p>

        {error && (
          <div className="mb-5 text-xs text-red-500 bg-red-50 px-3 py-2.5 rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Full name"
            name="fullName"
            type="text"
            placeholder="Craft UI"
            value={form.fullName}
            onChange={handleChange}
            icon={<PersonIcon />}
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            placeholder="support@craftui.com"
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
          <InputField
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Confirm password..."
            value={form.confirmPassword}
            onChange={handleChange}
            isPassword
          />

          {/* Terms & conditions toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={[
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                  agreed ? "border-[#4361EE] bg-[#4361EE]" : "border-gray-300 bg-white",
                ].join(" ")}
              >
                {agreed && (
                  <svg viewBox="0 0 10 10" width="7" height="7" fill="white">
                    <circle cx="5" cy="5" r="3" />
                  </svg>
                )}
              </span>
            </div>
            <span className="text-xs text-gray-600">I agree with terms &amp; conditions</span>
          </label>

          {/* Action buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-[#1e3a5f] text-white text-sm font-semibold rounded-full hover:bg-[#16304f] transition-colors disabled:opacity-60"
            >
              {loading ? "Signing up…" : "Sign Up"}
            </button>
            <Link
              to="/login"
              className="flex-1 py-2.5 bg-[#eef2ff] text-[#4361EE] text-sm font-semibold rounded-full hover:bg-[#e0e7ff] transition-colors text-center"
            >
              Sign In
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
