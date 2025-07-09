import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-blue-800 text-white hover:bg-blue-800/80', // Deep blue, white text
        secondary:
          'border-blue-700 bg-blue-100 text-blue-800 hover:bg-blue-200', // Lighter blue with darker text and border
        destructive:
          'border-transparent bg-red-700 text-white hover:bg-red-700/80', // Retain red for destructive, but a deeper shade
        outline: 'text-blue-800 border-blue-400', // Blue text with a subtle blue border
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };