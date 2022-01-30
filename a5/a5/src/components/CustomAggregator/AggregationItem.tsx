import React, { useState } from "react";

interface AggregationItemProps {
  label: string;
  weight: number;
  setWeight: React.Dispatch<React.SetStateAction<number>>;
  percentage: number;
  setPercentage: React.Dispatch<React.SetStateAction<number>>;
}

export default function AggregationItem({
  label,
  weight,
  setWeight,
  percentage,
  setPercentage,
}: AggregationItemProps) {
  const [weightInput, setWeightInput] = useState("" + weight);
  const [percentageInput, setPercentageInput] = useState("" + percentage);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const nr = parseInt(value);
    if (e.target.name === "weight") {
      setWeightInput(value);
      if (!nr) return;
      setWeight(nr);
    } else if (e.target.name === "percentage") {
      setPercentageInput(value);
      if (!nr) return;
      setPercentage(nr);
    }
  };

  return (
    <div className="flex items-center space-x-5 bg-base-100 rounded-lg p-2">
      <h3 className={"font-bold w-[200px]"}>{label}</h3>
      <div className="form-control">
        <label className="input-group input-group-vertical">
          <span className={"bg-base-200"}>{"Weight: "}</span>
          <input
            name={"weight"}
            type="text"
            value={weightInput}
            onChange={onChange}
            className="input input-bordered"
          />
        </label>
      </div>
      <div className="form-control">
        <label className="input-group input-group-vertical">
          <span className={"bg-base-200"}>{"Above: "}</span>
          <input
            name={"percentage"}
            type="text"
            value={percentage}
            onChange={onChange}
            max={100}
            min={0}
            className="input input-bordered"
          />
        </label>
      </div>
    </div>
  );
}
