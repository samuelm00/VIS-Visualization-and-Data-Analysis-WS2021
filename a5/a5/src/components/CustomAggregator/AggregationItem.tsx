import React from "react";

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
  return (
    <div className="flex items-center space-x-5 bg-base-100 rounded-lg p-2">
      <h3 className={"font-bold w-[200px]"}>{label}</h3>
      <div className="form-control">
        <label className="input-group input-group-vertical">
          <span className={"bg-base-200"}>{"Weight: "}</span>
          <input
            type="text"
            value={weight}
            onChange={(e) => setWeight(parseInt(e.target.value))}
            className="input input-bordered"
          />
        </label>
      </div>
      <div className="form-control">
        <label className="input-group input-group-vertical">
          <span className={"bg-base-200"}>{"Above: "}</span>
          <input
            type="text"
            value={percentage}
            onChange={(e) => setPercentage(parseInt(e.target.value))}
            max={100}
            min={0}
            className="input input-bordered"
          />
        </label>
      </div>
    </div>
  );
}
