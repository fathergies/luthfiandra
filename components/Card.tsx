import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-soft border border-white/75 bg-white/70 p-6 shadow-soft backdrop-blur",
        className
      )}
      {...props}
    />
  );
}
