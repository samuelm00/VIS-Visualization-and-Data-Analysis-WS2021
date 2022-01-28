import React from "react";

interface SelectProps {
  options: string[];
  value: string;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  label: string;
}

export default function Select({
  value,
  setValue,
  options,
  label,
}: SelectProps) {
  return (
    <>
      <label className={"label"} htmlFor="custom-aggregator-select">
        {label}
      </label>
      <select
        id={"custom-aggregator-select"}
        className={"select select-bordered max-w-xs"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        {options.map((option, index) => (
          <option value={option} key={index}>
            {option}
          </option>
        ))}
      </select>
    </>
  );
}
