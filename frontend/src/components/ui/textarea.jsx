import React from "react";

export const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`w-full min-h-[120px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6A38C2] ${className}`}
    {...props}
  />
);

export default Textarea;