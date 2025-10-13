import React from "react";

export const Button = ({ className = "", variant = "default", ...props }) => {
  const base = "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default: "bg-[#6A38C2] text-white hover:bg-[#5b30a6]",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    link: "text-[#6A38C2] hover:underline bg-transparent px-0",
  };
  const cn = `${base} ${variants[variant] || variants.default} ${className}`;
  return <button className={cn} {...props} />;
};
