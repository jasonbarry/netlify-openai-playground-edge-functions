import { useState } from "react";
import "./TextArea.css";

interface Props {
  label: string;
  title?: string;
  onChange?: (key: string, value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  style?: any;
  value: string;
}

function TextArea(props: Props) {
  const { label, title, onChange, ...rest } = props;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const key = label.toLowerCase().replace(/ /g, "_");
    if (onChange) {
      onChange(key, e.target.value);
    }
  };

  return (
    <label className="textarea">
      <div>
        <code title={title}>{label}</code>
      </div>
      <textarea onChange={handleChange} {...rest} />
    </label>
  );
}

export default TextArea;
