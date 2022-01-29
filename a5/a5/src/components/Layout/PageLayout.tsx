import React from "react";

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className={"2xl:flex justify-center"}>
      <main className={"bg-base-100 p-8 space-y-10 max-w-[1440px]"}>
        {children}
      </main>
    </div>
  );
}
