import { useState } from "react";
import "./TextInput.css";

interface Props {
  label: string;
  title: string;
  onChange: (key: string, value: string) => void;
  value: string;
}

function TextInput(props: Props) {
  const { label, title, onChange, value } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = label.toLowerCase().replace(/ /g, "_");
    onChange(key, e.target.value);
  };

  return (
    <label className="textinput">
      <div>
        <code title={title}>{label}</code>
      </div>
      <input type="text" onChange={handleChange} value={value} />
    </label>
  );
}

export default TextInput;
