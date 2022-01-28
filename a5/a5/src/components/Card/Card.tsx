import React from "react";

interface CardProps {
  children: React.ReactNode;
}

export default function Card({ children }: CardProps) {
  return (
    <div className="card shadow-2xl bg-base-200">
      <div className="card-body">{children}</div>
    </div>
  );
}
