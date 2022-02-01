import React, { useState } from "react";
import Tooltip from "../Tooltip/Tooltip";
import { lab } from "d3";

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
      <Tooltip
        text={`Weight that is added when the percentage of "${label}" is greater than "Above"`}
      >
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
      </Tooltip>
      <Tooltip
        text={`Specifies at what percentage the weight is added. Eg. if the percentage is set to 50, the weight is added when the percentage of "${label}" is greater than 50.`}
      >
        <div className="form-control">
          <label className="input-group input-group-vertical">
            <span className={"bg-base-200"}>{"Above: "}</span>
            <input
              name={"percentage"}
              type="text"
              value={percentageInput}
              onChange={onChange}
              max={100}
              min={0}
              className="input input-bordered"
            />
          </label>
        </div>
      </Tooltip>
    </div>
  );
}
