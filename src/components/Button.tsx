"use client";

import { forwardRef } from "react";

export interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  isFullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className = '',
  variant = 'primary',
  isLoading = false,
  isFullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  children,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-[var(--color-storacha-red)] text-white hover:bg-[#B30F10] focus:ring-[var(--color-storacha-red)]',
    secondary: 'bg-[#B30F10] text-white hover:bg-[var(--color-storacha-red)] focus:ring-[#B30F10]',
    outline: 'border-2 border-[var(--color-storacha-red)] text-[var(--color-storacha-red)] hover:bg-[var(--color-storacha-red)] hover:text-white',
    ghost: 'text-[var(--color-storacha-red)] hover:bg-[var(--color-storacha-red)]/10'
  };

  const classes = [
    baseStyles,
    variants[variant],
    isFullWidth ? 'w-full' : '',
    className
  ].join(' ');

  return (
    <button
      ref={ref}
      className={classes}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          {leftIcon && <span className="inline-flex">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="inline-flex">{rightIcon}</span>}
        </div>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;