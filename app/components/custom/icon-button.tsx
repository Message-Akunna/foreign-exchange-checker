import * as React from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface IconButtonProps extends React.ComponentProps<typeof Button> {
  loading?: boolean
  icon?: React.ReactNode
  iconPlacement?: "left" | "right"
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      loading = false,
      icon,
      iconPlacement = "left",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Button ref={ref} className={cn("gap-2", className)} {...props}>
        {/* Left Icon (or Spinner if loading and placement is left) */}
        {iconPlacement === "left" && (loading || icon) && (
          <span className="inline-flex shrink-0 items-center justify-center">
            {loading ? <Spinner className="size-4" /> : icon}
          </span>
        )}

        {/* Children (Text) */}
        {children && <span>{children}</span>}

        {/* Right Icon (or Spinner if loading and placement is right) */}
        {iconPlacement === "right" && (loading || icon) && (
          <span className="inline-flex shrink-0 items-center justify-center">
            {loading ? <Spinner className="size-4" /> : icon}
          </span>
        )}
      </Button>
    )
  }
)

IconButton.displayName = "IconButton"

export { IconButton }
