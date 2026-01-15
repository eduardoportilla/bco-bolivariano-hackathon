import * as React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  icon: LucideIcon;
  size?: number | string;
  className?: string;
}

function Icon({
  icon: IconComponent,
  size = 24,
  className,
  ...props
}: IconProps) {
  return (
    <IconComponent
      size={size}
      className={cn("shrink-0", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export { Icon };
export type { IconProps };
