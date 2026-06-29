import * as React from 'react';
import { cn } from './utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-r2 font-sans font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-light disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-sage text-white hover:bg-sage-light shadow-sm': variant === 'primary',
            'border border-charcoal text-charcoal hover:bg-charcoal/5': variant === 'secondary',
            'hover:bg-charcoal/5 text-charcoal': variant === 'ghost',
            'h-8 px-3 text-xs': size === 'sm',
            'h-10 px-4 py-2': size === 'md',
            'h-12 px-8 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
