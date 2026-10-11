import React from "react"
import { Badge } from "@/components/atom/badge"
import { Check } from "lucide-react"

interface TemplateCardProps {
  title: string
  description: string
  tags: string[]
  icon: React.ReactNode
  isSelected: boolean
  onClick: () => void
}

export const TemplateCard = ({
  title,
  description,
  tags,
  icon,
  isSelected,
  onClick,
}: TemplateCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`relative flex h-full cursor-pointer flex-col gap-3 rounded-lg border p-4 transition-all duration-200 hover:bg-muted/30 ${
        isSelected
          ? "border-primary bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary))]"
          : "border-border/60 bg-transparent hover:border-border"
      } `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-md bg-muted text-foreground/80">
            {icon}
          </div>
          <span className="text-sm font-semibold">{title}</span>
        </div>
        {isSelected && (
          <Badge
            variant="secondary"
            className="absolute top-3 right-3 h-5 border-primary/20 bg-background px-1.5 text-[10px] font-medium text-foreground"
          >
            <Check className="mr-1 size-3" />
            Selected
          </Badge>
        )}
      </div>

      <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-1.5">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="h-5 border-border/50 bg-muted/40 px-1.5 text-[10px] font-normal text-muted-foreground"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  )
}
