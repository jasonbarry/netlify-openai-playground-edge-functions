import { useState } from "react";

interface Props {
  label: string;
  max: number;
  min: number;
  step: number;
  onChange: (number: number) => void;
  value: number;
}

function Range(props: Props) {
  const { label, onChange, ...rest } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <label>
      <div className="flex">
        <span>{label}</span>
        <input type="number" {...rest} onChange={handleChange} />
      </div>
      <input type="range" {...rest} onChange={handleChange} />
    </label>
  );
}

export default Range;
