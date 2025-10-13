import React, { forwardRef } from "react";

export const Avatar = forwardRef(({ className = "", children, ...props }, ref) => (
  <div ref={ref} className={`h-9 w-9 rounded-full overflow-hidden bg-gray-200 ${className}`} {...props}>
    {children}
  </div>
));

export const AvatarImage = ({ src, alt = "avatar" }) => (
  <img src={src} alt={alt} className="h-full w-full object-cover" />
);
