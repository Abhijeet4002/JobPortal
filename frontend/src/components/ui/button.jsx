import React from "react";

export const Button = ({ className = "", variant = "default", size, ...props }) => {
  const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  const variants = {
    default: "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]",
    outline: "border border-[var(--border-color)] bg-[var(--surface)] hover:bg-[var(--surface-alt)] text-[var(--text)]",
    link: "text-[var(--primary)] hover:underline bg-transparent px-0",
    ghost: "",
  };
  const cn = `${base} ${sizes[size] || sizes.default} ${variants[variant] ?? variants.default} ${className}`;
  return <button className={cn} {...props} />;
};
