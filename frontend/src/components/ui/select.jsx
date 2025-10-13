import React from 'react';

export const Select = ({ children, onValueChange, ...props }) => (
  <select onChange={(e) => onValueChange?.(e.target.value)} {...props}>{children}</select>
);
export const SelectTrigger = ({ children, ...props }) => <div {...props}>{children}</div>;
export const SelectValue = ({ placeholder }) => <span>{placeholder}</span>;
export const SelectContent = ({ children }) => <>{children}</>;
export const SelectGroup = ({ children }) => <>{children}</>;
export const SelectItem = ({ children, value }) => <option value={value}>{children}</option>;
