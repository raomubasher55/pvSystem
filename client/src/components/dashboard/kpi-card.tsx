import { GlowCard } from "@/components/ui/glow-card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
  pulsate?: boolean;
}

export default function KpiCard({
  title,
  value,
  change,
  icon,
  variant = "default",
  pulsate = false
}: KpiCardProps) {
  const isPositive = change >= 0;
  
  return (
    <GlowCard variant={variant} pulsate={pulsate}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          variant === "default" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400" :
          variant === "success" ? "bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400" :
          variant === "warning" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400" :
          "bg-teal-100 dark:bg-teal-900/30 text-teal-500 dark:text-teal-400"
        )}>
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={cn(
          "flex items-center text-sm font-medium",
          isPositive ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"
        )}>
          {isPositive ? (
            <ArrowUp className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDown className="h-4 w-4 mr-1" />
          )}
          <span>{Math.abs(change)}%</span>
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">from yesterday</span>
      </div>
    </GlowCard>
  );
}
