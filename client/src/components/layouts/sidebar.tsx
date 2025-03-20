import { Link, useLocation } from "wouter";
import { 
  GaugeCircle, 
  BarChart3, 
  Plug, 
  PanelTop, 
  CloudSun, 
  Settings, 
  Bell,
  Battery,
  Zap,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [location] = useLocation();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    powerSources: false
  });
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const isActive = (path: string) => location === path;
  
  return (
    <aside className="lg:w-64 lg:fixed lg:h-screen bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 lg:pt-6 shadow-sm z-10">
      <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between lg:justify-start lg:gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-500 glow flex items-center justify-center text-white">
            <PanelTop className="h-4 w-4" />
          </div>
          <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">SolarVision</h1>
        </div>
      </div>
      
      <nav className="p-4">
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Main</p>
          <ul className="space-y-1">
            <li>
              <Link href="/">
                <a className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                  isActive("/") 
                    ? "bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400 font-medium" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}>
                  <GaugeCircle className="h-5 w-5" />
                  <span>Dashboard</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/energy-history">
                <a className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                  isActive("/energy-history") 
                    ? "bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400 font-medium" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}>
                  <BarChart3 className="h-5 w-5" />
                  <span>Energy History</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/grid-monitoring">
                <a className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                  isActive("/grid-monitoring") 
                    ? "bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400 font-medium" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}>
                  <Plug className="h-5 w-5" />
                  <span>Grid Monitoring</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/generator">
                <a className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                  isActive("/generator") 
                    ? "bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400 font-medium" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}>
                  <PanelTop className="h-5 w-5" />
                  <span>Generator</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/weather">
                <a className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                  isActive("/weather") 
                    ? "bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400 font-medium" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}>
                  <CloudSun className="h-5 w-5" />
                  <span>Weather</span>
                </a>
              </Link>
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Power Sources</p>
          <ul className="space-y-1">
            <li>
              <button 
                onClick={() => toggleSection('powerSources')}
                className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <div className="flex items-center gap-3">
                  <Battery className="h-5 w-5" />
                  <span>Inverters</span>
                </div>
                {expandedSections.powerSources ? 
                  <ChevronDown className="h-4 w-4" /> : 
                  <ChevronRight className="h-4 w-4" />
                }
              </button>
              
              {expandedSections.powerSources && (
                <ul className="mt-1 ml-8 space-y-1">
                  <li>
                    <Link href="/sources/inverter1">
                      <a className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                        location.includes('/sources/inverter1')
                          ? "bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400 font-medium" 
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                      }`}>
                        <Battery className="h-4 w-4" />
                        <span>Inverter 1</span>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/sources/inverter2">
                      <a className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                        location.includes('/sources/inverter2')
                          ? "bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400 font-medium" 
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                      }`}>
                        <Battery className="h-4 w-4" />
                        <span>Inverter 2</span>
                      </a>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link href="/grid-monitoring">
                <a className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                  isActive("/grid-monitoring") 
                    ? "bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400 font-medium" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}>
                  <Zap className="h-5 w-5" />
                  <span>Grid</span>
                </a>
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Settings</p>
          <ul className="space-y-1">
            <li>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">
                <Settings className="h-5 w-5" />
                <span>System Settings</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="mt-auto p-4 border-t border-gray-200 dark:border-slate-700 hidden lg:block">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
            <span className="text-sm font-medium">AJ</span>
          </div>
          <div>
            <p className="text-sm font-medium">Alex Johnson</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">System Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
