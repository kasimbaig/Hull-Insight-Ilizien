import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-hull-primary text-white hover:bg-hull-primary-dark shadow-sm hover:shadow-md",
        destructive: "bg-hull-accent text-white hover:bg-hull-accent/90 shadow-sm",
        outline: "border border-input bg-background hover:bg-hull-secondary hover:text-foreground shadow-sm",
        secondary: "bg-hull-secondary text-foreground hover:bg-hull-secondary/80 shadow-sm",
        ghost: "hover:bg-hull-secondary hover:text-foreground",
        link: "text-hull-primary underline-offset-4 hover:underline",
        success: "bg-hull-success text-white hover:bg-hull-success/90 shadow-sm",
        warning: "bg-hull-warning text-white hover:bg-hull-warning/90 shadow-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
