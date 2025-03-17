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
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 py-2 lg:hidden z-10">
      <div className="grid grid-cols-5 gap-1">
        <Link href="/">
          <a className={`flex flex-col items-center py-1 ${isActive("/") ? "text-primary-600 dark:text-primary-400" : "text-gray-500 dark:text-gray-400"}`}>
            <GaugeCircle className="h-5 w-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </a>
        </Link>
        <Link href="/energy-history">
          <a className={`flex flex-col items-center py-1 ${isActive("/energy-history") ? "text-primary-600 dark:text-primary-400" : "text-gray-500 dark:text-gray-400"}`}>
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs mt-1">History</span>
          </a>
        </Link>
        <Link href="/grid-monitoring">
          <a className={`flex flex-col items-center py-1 ${isActive("/grid-monitoring") ? "text-primary-600 dark:text-primary-400" : "text-gray-500 dark:text-gray-400"}`}>
            <Plug className="h-5 w-5" />
            <span className="text-xs mt-1">Grid</span>
          </a>
        </Link>
        <Link href="/generator">
          <a className={`flex flex-col items-center py-1 ${isActive("/generator") ? "text-primary-600 dark:text-primary-400" : "text-gray-500 dark:text-gray-400"}`}>
            <PanelTop className="h-5 w-5" />
            <span className="text-xs mt-1">Generator</span>
          </a>
        </Link>
        <Link href="/weather">
          <a className={`flex flex-col items-center py-1 ${isActive("/weather") ? "text-primary-600 dark:text-primary-400" : "text-gray-500 dark:text-gray-400"}`}>
            <CloudSun className="h-5 w-5" />
            <span className="text-xs mt-1">Weather</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
