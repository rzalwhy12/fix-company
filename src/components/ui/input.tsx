import * as React from 'react';

import { cn } from '@/lib/utils';

// Ubah interface menjadi type alias
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md',
          'border border-blue-400', // Border warna biru lembut
          'bg-white text-blue-950', // Background putih bersih
          'px-3 py-2 text-sm',
          'ring-offset-background',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
          'placeholder:text-gray-500', // Placeholder abu-abu
          'focus-visible:outline-none',
          'focus-visible:ring-2 focus-visible:ring-blue-600', // Ring biru lebih gelap saat fokus
          'focus-visible:ring-offset-2',
          'focus-visible:shadow-lg focus-visible:shadow-blue-200/50', // Shadow lembut untuk efek luxury
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };