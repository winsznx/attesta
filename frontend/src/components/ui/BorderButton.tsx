"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BorderButton({ className, children, ...props }: ButtonProps) {
  return (
    <Button
      className={cn("relative overflow-hidden group border-2 border-transparent", className)}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 border-2 border-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="absolute top-0 left-0 w-0 h-0 border-t-2 border-l-2 border-fuchsia-500 group-hover:w-full group-hover:h-full transition-all duration-500" />
        <span className="absolute bottom-0 right-0 w-0 h-0 border-b-2 border-r-2 border-fuchsia-500 group-hover:w-full group-hover:h-full transition-all duration-500" />
      </span>
    </Button>
  );
}

