import React from "react";

interface TooltipProps {
  children: React.ReactNode;
  text: string;
}

export default function Tooltip({ children, text }: TooltipProps) {
  return (
    <div data-tip={text} className="tooltip">
      {children}
    </div>
  );
}
