import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardProps } from "@/components/ui/card";

type GlowVariant = "default" | "success" | "warning" | "danger";

interface GlowCardProps extends CardProps {
  variant?: GlowVariant;
  pulsate?: boolean;
  children?: React.ReactNode;
}

const variantClasses = {
  default: "glow",
  success: "glow-success",
  warning: "glow-warning",
  danger: "glow-danger"
};

export function GlowCard({
  variant = "default",
  pulsate = false,
  className,
  children,
  ...props
}: GlowCardProps) {
  return (
    <Card 
      className={cn(
        variantClasses[variant],
        pulsate && "animate-glow-pulse",
        className
      )}
      {...props}
    >
      <CardContent className="p-5">
        {children}
      </CardContent>
    </Card>
  );
}
