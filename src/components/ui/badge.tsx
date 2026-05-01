import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[#D4AF37] text-white hover:bg-[#B8960C]',
        secondary: 'border-transparent bg-[#1E5F8E] text-white hover:bg-[#0E4F7E]',
        destructive: 'border-transparent bg-[#C84B31] text-white hover:bg-[#A83B21]',
        outline: 'text-foreground',
        sand: 'border-transparent bg-[#E8D5B7] text-[#2C2C2C]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
