import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  illustration: ReactNode;
  pageLabel: string;
}

export default function AuthLayout({ children, illustration }: Readonly<AuthLayoutProps>) {
  return (
    <div className="h-screen bg-[#f2e8e5] flex flex-col overflow-hidden">

      {/* Full-page split — no card, fills remaining height */}
      <div className="flex-1 flex min-h-0">
        {/* Left: form panel */}
        <div className="flex-1 flex flex-col justify-center items-center bg-white px-10 py-8 sm:px-16 lg:px-24 overflow-y-auto">
          {children}
        </div>

        {/* Right: illustration panel */}
        <div
          className="hidden lg:flex relative w-[45%] flex-shrink-0 overflow-hidden items-center justify-center"
          style={{ background: "linear-gradient(150deg, #4361EE 0%, #3651d4 100%)" }}
        >
          {/* Decorative concentric rings */}
          <div className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full border border-white/10" />
          <div className="absolute -top-14 -right-14 w-[360px] h-[360px] rounded-full border border-white/10" />
          <div className="absolute -bottom-24 -left-24 w-[360px] h-[360px] rounded-full border border-white/10" />
          <div className="absolute -bottom-10 -left-10 w-[240px] h-[240px] rounded-full border border-white/10" />
          <div className="relative z-10">
            {illustration}
          </div>
        </div>
      </div>
    </div>
  );
}
