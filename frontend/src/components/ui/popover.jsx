import React, { useState, useRef, useEffect, createContext, useContext, cloneElement } from "react";

const PopoverContext = createContext(null);

export const Popover = ({ children }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const contentRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!open) return;
      const container = containerRef.current;
      if (container && container.contains(e.target)) return;
      setOpen(false);
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerRef, contentRef }}>
      <div ref={containerRef} className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  );
};

export const PopoverTrigger = ({ asChild, children }) => {
  const ctx = useContext(PopoverContext);
  if (!ctx) return children;
  const { open, setOpen, triggerRef } = ctx;
  const child = React.Children.only(children);
  return cloneElement(child, {
    ref: (node) => {
      if (typeof child.ref === "function") child.ref(node);
      else if (child.ref) child.ref.current = node;
      triggerRef.current = node;
    },
    onClick: (e) => {
      if (child.props.onClick) child.props.onClick(e);
      setOpen(!open);
    },
    "aria-haspopup": "menu",
    "aria-expanded": open,
    role: "button",
    tabIndex: 0,
    onKeyDown: (e) => {
      if (child.props.onKeyDown) child.props.onKeyDown(e);
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(!open);
      }
    }
  });
};

export const PopoverContent = ({ className = "", children }) => {
  const ctx = useContext(PopoverContext);
  if (!ctx) return null;
  const { open, contentRef } = ctx;
  if (!open) return null;
  return (
    <div ref={contentRef} className={`absolute right-0 z-50 mt-2 w-64 rounded-md border bg-white p-4 shadow-lg ${className}`}>
      {children}
    </div>
  );
};
