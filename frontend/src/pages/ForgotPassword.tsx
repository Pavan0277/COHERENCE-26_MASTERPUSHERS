import React, { useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import InputField from "../components/auth/InputField";
import SocialButtons from "../components/auth/SocialButtons";
import RecoverIllustration from "../components/auth/illustrations/RecoverIllustration";

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

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      // Backend /auth/forgot-password endpoint — simulating network delay until wired up
      await new Promise((resolve) => setTimeout(resolve, 900));
      setSuccess("Password reset link sent! Check your inbox.");
      setEmail("");
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      setError(apiErr.response?.data?.message ?? "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout illustration={<RecoverIllustration />} pageLabel="Recover">
      <div className="w-full max-w-xl">
        <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-3">
          Lost your password?<br />
          Enter your details to recover.
        </h1>
        <p className="text-sm text-gray-400 mb-9">Enter your details to proceed further</p>

        {error && (
          <div
            role="alert"
            className="mb-5 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-3 rounded-lg"
          >
            {error}
          </div>
        )}

        {success && (
          <output className="block mb-5 text-sm text-green-700 bg-green-50 border border-green-100 px-3 py-3 rounded-lg">
            {success}
          </output>
        )}

        <form onSubmit={handleSubmit} className="space-y-7">
          <InputField
            label="Email"
            name="email"
            type="email"
            placeholder="Start typing..."
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            icon={<MailIcon />}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-[#1e3a5f] text-white text-base font-semibold rounded-full hover:bg-[#16304f] transition-colors disabled:opacity-60"
          >
            {loading ? "Sending…" : "Recover"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Remembered your password?{" "}
          <Link to="/login" className="text-[#4361EE] hover:underline font-medium">
            Sign In
          </Link>
        </p>

        <div className="mt-6">
          <SocialButtons />
        </div>
      </div>
    </AuthLayout>
  );
}
