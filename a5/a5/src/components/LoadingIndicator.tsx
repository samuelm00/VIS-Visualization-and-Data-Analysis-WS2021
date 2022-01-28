import React from "react";

export default function LoadingIndicator() {
  return (
    <div className={"flex items-center space-x-10"}>
      {/*SVG from the official docs of tailwind: https://tailwindcss.com/docs/animation#spin */}
      <div
        className={
          "rounded-full w-14 h-14 animate-bounce bg-base-200 flex justify-center p-2 border-2 border-gray-500"
        }
      >
        <svg
          className="text-info"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
      <p className={"font-bold"}>Loading dataset ... </p>
    </div>
  );
}
