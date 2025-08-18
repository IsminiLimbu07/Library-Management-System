import React from "react";
import { cn } from "../../lib/utils";

// Simple HTML select component
const Select = React.forwardRef(({ className = '', children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn('input', className)}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

const SelectOption = React.forwardRef(({ className = '', ...props }, ref) => (
  <option
    ref={ref}
    className={className}
    {...props}
  />
));
SelectOption.displayName = "SelectOption";

export { Select, SelectOption };
