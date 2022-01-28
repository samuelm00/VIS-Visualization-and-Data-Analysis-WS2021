import React from "react";
import { WithClassName } from "../../utils/utils.components";
import clsx from "clsx";

interface CardProps extends WithClassName {
  children: React.ReactNode;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div className={clsx("card shadow-2xl bg-base-200", className)}>
      <div className="card-body">{children}</div>
    </div>
  );
}
