import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border-2 border-border px-2.5 py-0.5 font-pixel text-[0.7rem] transition-colors uppercase tracking-wider rounded-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-pixel-sm",
        secondary:
          "bg-secondary text-secondary-foreground",
        destructive:
          "bg-destructive text-destructive-foreground",
        outline:
          "text-foreground bg-transparent",
        success:
          "bg-success text-success-foreground shadow-pixel-sm",
        warning:
          "bg-warning text-warning-foreground shadow-pixel-sm",
        xp:
          "bg-xp text-xp-foreground shadow-pixel-sm",
        coin:
          "bg-coin text-coin-foreground shadow-pixel-sm",
        forest:
          "bg-forest text-foreground shadow-pixel-sm",
        accent:
          "bg-accent text-accent-foreground shadow-pixel-sm",
        gold:
          "bg-primary text-primary-foreground shadow-pixel-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
