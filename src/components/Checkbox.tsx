import { useState } from "react";

interface Props {
  label: string;
  onChange: (key: string, value: boolean) => void;
  value: boolean;
}

function Checkbox(props: Props) {
  const { label, onChange, value } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = label.toLowerCase().replace(/ /g, "_");
    onChange(key, e.target.checked);
  };

  return (
    <label>
      <input defaultChecked={value} type="checkbox" onChange={handleChange} />
      <code>{label}</code>
    </label>
  );
}

export default Checkbox;
