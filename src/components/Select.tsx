import { useState } from "react";
import "./Select.css";

interface Props {
  label: string;
  onChange: (key: string, value: string) => void;
  options:
    | string[]
    | Array<{
        label: string;
        value: string;
      }>;
  value: string;
}

function Select(props: Props) {
  const { label, onChange, options, value } = props;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = label.toLowerCase().replace(/ /g, "_");
    onChange(key, e.target.value);
  };

  return (
    <label className="select">
      <div>
        <code>{label}</code>
      </div>
      <select onChange={handleChange} value={value}>
        {options.map((option) =>
          typeof option === "string" ? (
            <option key={option}>{option}</option>
          ) : (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          )
        )}
      </select>
    </label>
  );
}

export default Select;
