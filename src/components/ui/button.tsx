import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Aqua gel pill: the main action.
        default: "aero-gel font-semibold",
        // Grass gel pill: adding and sending.
        grass: "aero-gel aero-gel--grass font-semibold",
        destructive: "aero-gel aero-gel--red font-semibold",
        // Windows 7 command buttons.
        outline: "aero-cmd font-normal",
        secondary: "aero-cmd font-normal",
        // Explorer row: transparent until hovered.
        ghost: "aero-hover-row text-foreground",
        link: "aero-link underline-offset-4",
      },
      size: {
        default: "min-h-[44px] h-11 px-5 py-2", // 44px minimum touch target
        sm: "min-h-[44px] h-11 px-3 text-xs", // 44px minimum touch target
        lg: "min-h-[44px] h-12 px-8 text-base", // 48px for larger buttons
        icon: "min-h-[44px] min-w-[44px] h-11 w-11", // 44x44px minimum
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
