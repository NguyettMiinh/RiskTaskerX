import { Form, Input } from "antd";
import { Rule } from "antd/es/form";
import React from "react";

interface CustomInputProps {
  name: string;
  label: string;
  disable?: boolean;
  rules?: Rule[];
  required?: boolean;
  placeholder?: string;
  className?: string;
  colon?: boolean;
}
const InputFormComponent: React.FC<CustomInputProps> = ({
  name,
  label,
  disable,
  rules,
  required,
  colon,
  placeholder,
  className = "",
}) => {
  return (
    <Form.Item name={name} label={label} rules={rules} required={required} colon={colon}>
      <Input
        disabled={disable}
        className={`font-normal ${className}`}
        placeholder={placeholder}
      />
    </Form.Item>
  );
};

export default InputFormComponent;
