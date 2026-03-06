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

        {/* Right: full-bleed image panel — no background, image fills the area */}
        <div className="hidden lg:block w-[45%] flex-shrink-0 overflow-hidden">
          {illustration}
        </div>
      </div>
    </div>
  );
}
