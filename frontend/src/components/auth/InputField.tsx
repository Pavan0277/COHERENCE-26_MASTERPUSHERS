import { useState, type InputHTMLAttributes, type ReactNode } from "react";

const EyeIcon = () => (
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
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
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
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  icon?: ReactNode;
  isPassword?: boolean;
  type?: string;
}

export default function InputField({
  label,
  icon,
  isPassword = false,
  type,
  className,
  ...props
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword ? (showPassword ? "text" : "password") : (type ?? "text");

  return (
    <div className="w-full">
      <label className="block text-[11px] text-gray-400 mb-1.5 tracking-wide">
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          type={inputType}
          className={[
            "w-full border-0 border-b border-gray-200 pb-2.5 text-sm text-gray-800 bg-transparent",
            "focus:outline-none focus:border-gray-500 placeholder:text-gray-400 transition-colors pr-8",
            className ?? "",
          ].join(" ")}
        />
        <div className="absolute right-0 bottom-2.5 flex items-center text-gray-300">
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="hover:text-gray-500 transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          ) : icon ? (
            <span className="pointer-events-none">{icon}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
