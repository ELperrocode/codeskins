import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-text-inverse shadow-sm hover:bg-gradient-primary-hover hover:shadow-md active:scale-95",
        destructive: "bg-error-500 text-text-inverse shadow-sm hover:bg-error-600 active:scale-95",
        outline: "border border-border-primary bg-transparent text-text-primary shadow-sm hover:bg-background-secondary hover:text-text-primary active:scale-95",
        secondary: "bg-background-secondary text-text-primary shadow-sm hover:bg-background-tertiary active:scale-95",
        ghost: "text-text-primary hover:bg-background-secondary hover:text-text-primary active:scale-95",
        link: "text-primary-600 underline-offset-4 hover:underline active:scale-95",
        glass: "bg-background-glass backdrop-blur-md border border-white/20 text-text-inverse shadow-sm hover:bg-white/20 active:scale-95",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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