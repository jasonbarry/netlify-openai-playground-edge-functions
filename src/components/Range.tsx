import { useState } from "react";

import "./Range.css";

interface Props {
  label: string;
  title?: string;
  max: number;
  min: number;
  step: number;
  onChange: (key: string, value: number) => void;
  value: number;
}

function Range(props: Props) {
  const { label, title, onChange, ...rest } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = label.toLowerCase().replace(/ /g, "_");
    onChange(key, Number(e.target.value));
  };

  return (
    <label className="range">
      <div className="flex">
        <code title={title}>{label}</code>
        <input type="number" {...rest} onChange={handleChange} />
      </div>
      <input type="range" {...rest} onChange={handleChange} />
    </label>
  );
}

export default Range;
