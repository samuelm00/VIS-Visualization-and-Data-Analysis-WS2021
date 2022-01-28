import React from "react";

interface HeaderProps {
  children: React.ReactNode;
  variant: "section" | "page";
}

export default function Header({ children, variant }: HeaderProps) {
  return variant === "page" ? (
    <h1 className={"text-6xl font-bold"}>{children}</h1>
  ) : (
    <h2 className={"text-3xl font-bold"}>{children}</h2>
  );
}
