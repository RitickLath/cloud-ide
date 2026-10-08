import React from 'react'
import { Badge } from '@/components/atom/badge'
import { Check } from 'lucide-react'

interface TemplateCardProps {
    title: string
    description: string
    tags: string[]
    icon: React.ReactNode
    isSelected: boolean
    onClick: () => void
}

export const TemplateCard = ({ title, description, tags, icon, isSelected, onClick }: TemplateCardProps) => {
    return (
        <div 
            onClick={onClick}
            className={`
                relative p-4 rounded-lg cursor-pointer transition-all duration-200 border
                flex flex-col gap-3 h-full hover:bg-muted/30
                ${isSelected 
                    ? 'border-primary bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary))]' 
                    : 'border-border/60 bg-transparent hover:border-border'
                }
            `}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center size-6 rounded-md bg-muted text-foreground/80">
                        {icon}
                    </div>
                    <span className="font-semibold text-sm">{title}</span>
                </div>
                {isSelected && (
                    <Badge variant="secondary" className="bg-background text-foreground text-[10px] h-5 px-1.5 font-medium border-primary/20 absolute right-3 top-3">
                        <Check className="size-3 mr-1" />
                        Selected
                    </Badge>
                )}
            </div>
            
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                {description}
            </p>
            
            <div className="flex items-center gap-1.5 flex-wrap mt-auto">
                {tags.map(tag => (
                    <Badge key={tag} variant="outline" className="bg-muted/40 text-[10px] font-normal px-1.5 h-5 text-muted-foreground border-border/50">
                        {tag}
                    </Badge>
                ))}
            </div>
        </div>
    )
}
