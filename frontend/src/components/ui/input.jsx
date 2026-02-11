import React from "react";

export const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full border border-[var(--border-color)] rounded-[10px] px-3.5 py-2.5 text-[0.925rem] bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/12 ${className}`}
    {...props}
  />
);
