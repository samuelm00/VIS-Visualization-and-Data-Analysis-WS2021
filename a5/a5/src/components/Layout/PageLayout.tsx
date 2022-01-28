import React from "react";

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return <main className={"bg-base-100 p-8 space-y-10"}>{children}</main>;
}
