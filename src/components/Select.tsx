import { useState } from "react";

interface Props {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  value: string;
}

function Select(props: Props) {
  const { label, onChange, options, value } = props;

  return (
    <label>
      <div>
        <span>{label}</span>
      </div>
      <select onChange={onChange} value={value}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

export default Select;
