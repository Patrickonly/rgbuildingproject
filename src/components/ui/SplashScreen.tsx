import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [animatingOut, setAnimatingOut] = useState(false);

  useEffect(() => {
    // Only show splash screen once per session
    if (sessionStorage.getItem("splash_shown")) {
      setVisible(false);
      return;
    }

    sessionStorage.setItem("splash_shown", "true");

    // Show splash screen for 1.5 seconds, then animate out
    const timer = setTimeout(() => {
      setAnimatingOut(true);
      setTimeout(() => setVisible(false), 500); // 500ms for fade out animation
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#2563eb] transition-opacity duration-500 ${
        animatingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center">
        {/* Popping Animation */}
        <div className="relative">
          <div className="absolute inset-0 bg-white/20 rounded-3xl animate-ping" />
          <div className="relative h-24 w-24 rounded-3xl bg-white flex items-center justify-center shadow-2xl animate-bounce">
            <Building2 className="h-12 w-12 text-[#2563eb]" />
          </div>
        </div>
        <div className="mt-8 text-white font-extrabold text-3xl tracking-tight animate-pulse" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
          RG Market
        </div>
        <div className="mt-2 text-blue-200 text-sm font-medium uppercase tracking-widest">
          Property Management System
        </div>
      </div>
    </div>
  );
}
