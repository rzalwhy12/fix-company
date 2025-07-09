import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-blue-800 text-amber-300 hover:bg-blue-900', // Deep blue with gold text
        destructive:
          'bg-red-700 text-white hover:bg-red-800', // Deeper red for destructive actions
        outline:
          'border border-blue-600 bg-transparent text-blue-800 hover:bg-blue-100 hover:text-blue-900', // Blue border, blue text, light blue hover
        secondary:
          'bg-amber-300 text-blue-800 hover:bg-amber-400', // Gold background with deep blue text
        ghost: 'text-blue-800 hover:bg-blue-100 hover:text-blue-900', // Subtle blue for ghost, light blue hover
        link: 'text-blue-800 underline-offset-4 hover:underline hover:text-blue-900', // Deep blue link
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };