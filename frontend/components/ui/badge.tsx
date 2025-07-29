import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary-500 text-text-inverse hover:bg-primary-600",
        secondary:
          "border-border-primary bg-background-secondary text-text-secondary hover:bg-background-tertiary",
        destructive:
          "border-transparent bg-error-500 text-text-inverse hover:bg-error-600",
        outline: "text-text-primary border-border-primary",
        success:
          "border-transparent bg-success-500 text-text-inverse hover:bg-success-600",
        warning:
          "border-transparent bg-warning-500 text-text-inverse hover:bg-warning-600",
        info:
          "border-transparent bg-info-500 text-text-inverse hover:bg-info-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants } 