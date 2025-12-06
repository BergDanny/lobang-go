import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-pixel text-pixel-xs transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-4 border-border active:translate-x-1 active:translate-y-1 active:shadow-none uppercase tracking-wider rounded-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-pixel-gold hover:brightness-110",
        destructive:
          "bg-destructive text-destructive-foreground shadow-pixel hover:brightness-110",
        outline:
          "bg-transparent border-border text-foreground shadow-pixel hover:bg-muted",
        secondary:
          "bg-secondary text-secondary-foreground shadow-pixel hover:brightness-110",
        ghost:
          "border-transparent shadow-none hover:bg-muted",
        link:
          "text-primary underline-offset-4 hover:underline border-none shadow-none",
        success:
          "bg-success text-success-foreground shadow-pixel-success hover:brightness-110",
        quest:
          "bg-forest text-foreground shadow-pixel hover:bg-forest-light",
        gold:
          "bg-gradient-to-r from-primary to-warning text-primary-foreground shadow-pixel-gold hover:brightness-110",
        accent:
          "bg-accent text-accent-foreground shadow-pixel-accent hover:brightness-110",
        warning:
          "bg-warning text-warning-foreground shadow-pixel hover:brightness-110",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 px-4 text-[0.5rem]",
        lg: "h-12 px-8",
        xl: "h-14 px-10 text-pixel-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
