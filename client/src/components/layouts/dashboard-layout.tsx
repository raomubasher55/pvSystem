import React from "react";
import Sidebar from "./sidebar";
import Topbar from "./topbar";
import Footer from "./footer";
import MobileNav from "./mobile-nav";
import { useTheme } from "@/hooks/use-theme";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { theme } = useTheme();
  
  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 text-gray-800 dark:bg-slate-900 dark:text-gray-100 transition-colors duration-300">
        <Sidebar />
        <main className="flex-1 lg:ml-64">
          <Topbar />
          {children}
          <Footer />
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
