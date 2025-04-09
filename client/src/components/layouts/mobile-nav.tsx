import { Link, useLocation } from "wouter";
import { 
  GaugeCircle, 
  BarChart3, 
  Plug, 
  PanelTop, 
  CloudSun
} from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();
  
  const isActive = (path: string) => location === path;
  
  // Define the navigation items
  const navItems = [
    { path: "/", icon: <GaugeCircle className="h-5 w-5" />, label: "Dashboard" },
    { path: "/energy-history", icon: <BarChart3 className="h-5 w-5" />, label: "History" },
    { path: "/grid-monitoring", icon: <Plug className="h-5 w-5" />, label: "Grid" },
    { path: "/generator", icon: <PanelTop className="h-5 w-5" />, label: "Generator" },
    { path: "/weather", icon: <CloudSun className="h-5 w-5" />, label: "Weather" }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 py-2 lg:hidden z-10">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <div className={`flex flex-col items-center justify-center py-1 cursor-pointer ${
              isActive(item.path) 
                ? "text-blue-600 dark:text-blue-400" 
                : "text-gray-500 dark:text-gray-400"
            }`}>
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
