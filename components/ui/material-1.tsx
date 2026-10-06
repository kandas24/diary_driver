import React, { forwardRef } from "react";
import clsx from "clsx";

interface MaterialProps {
  type?: "menu" | "sheet" | "card";
  className?: string;
  children?: React.ReactNode;
}

export const Material = forwardRef<HTMLDivElement, MaterialProps>(
  ({ type = "menu", className, children }, ref) => (
    <div
      ref={ref}
      data-material={type}
      className={clsx(
        "bg-background-100 border border-gray-alpha-100 rounded-xl shadow-lg",
        className
      )}
    >
      {children}
    </div>
  )
);

Material.displayName = "Material";