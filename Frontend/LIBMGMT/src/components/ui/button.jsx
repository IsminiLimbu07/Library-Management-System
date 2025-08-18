import React from "react";
import { cn } from "../../lib/utils";

const Button = React.forwardRef(({ 
  className = '', 
  variant = 'primary', 
  size = 'default', 
  children,
  ...props 
}, ref) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    destructive: 'btn-destructive'
  };
  
  const sizeClasses = {
    default: '',
    sm: 'text-xs px-3 py-1',
    lg: 'text-lg px-8 py-3'
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || '',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };
