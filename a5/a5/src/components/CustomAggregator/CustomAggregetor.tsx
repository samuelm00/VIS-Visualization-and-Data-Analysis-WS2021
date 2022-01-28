import React, { useState } from "react";
import Select from "../Select/Select";

const categories = ["People", "Development"];

export default function CustomAggregator() {
  const [currentCategory, setCurrentCategory] = useState(categories[0]);

  return (
    <div>
      <Select
        options={categories}
        value={currentCategory}
        setValue={setCurrentCategory}
        label={"Category"}
      />
    </div>
  );
}
