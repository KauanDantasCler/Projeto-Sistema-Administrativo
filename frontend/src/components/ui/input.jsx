import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm transition-all duration-200 outline-none file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:ring-offset-0",
        "disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-60",
        "file:not-disabled:cursor-pointer file:border-0 file:text-foreground file:transition-colors hover:file:text-foreground/80",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
})

Input.displayName = "Input"

export { Input }