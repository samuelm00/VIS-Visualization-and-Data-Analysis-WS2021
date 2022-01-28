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
    <div className="flex justify-evenly items-center">
      <h3 className={"font-bold"}>{label}</h3>
      <div className="form-control">
        <label className="input-group">
          <span className={"bg-base-300"}>{"Weight: "}</span>
          <input
            type="text"
            value={weight}
            onChange={(e) => setWeight(parseInt(e.target.value))}
            className="input input-bordered"
          />
        </label>
      </div>
      <div className="form-control">
        <label className="input-group">
          <span className={"bg-base-300"}>{"Above: "}</span>
          <input
            type="text"
            value={percentage}
            onChange={(e) => setPercentage(parseInt(e.target.value))}
            placeholder="10"
            className="input input-bordered"
          />
        </label>
      </div>
    </div>
  );
}
