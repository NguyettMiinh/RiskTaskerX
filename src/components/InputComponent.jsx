import React from "react";
import { Input } from "antd";

const InputComponent = ({
  prefix,
  field,
  placeholder,
  className,
  autoComplete,
  size="large",
  allowClear = false,
  disabled = false,
  maxLength,
  onChange,
  onPressEnter,
  status,
  defaultValue,
  value,
  type = "text",
}) => {
  return (
    <Input
      size={size}
      prefix={prefix}
      {...field}
      placeholder={placeholder}
      className={className}
      autoComplete={autoComplete}
      allowClear={allowClear}
      disabled={disabled}
      maxLength={maxLength}
      onChange={onChange}
      onPressEnter={onPressEnter}
      status={status}
      defaultValue={defaultValue}
      value={value}
      type={type}
    />
  );
};

export default InputComponent;
