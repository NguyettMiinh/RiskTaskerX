import React from "react";
import { Controller } from "react-hook-form";
import { Input, Form, message } from "antd";
const InputField = ({
  name,
  control,
  prefix,
  placeholder,
  className,
  autoComplete,
  size = "large",
  error,
  style,
  length,
  onFocus,
  onBlur,
}) => {
  let InputOption;
  switch (name) {
    case "password":
      InputOption = Input.Password;
      break;
    case "confirmPassword":
        InputOption = Input.Password;
        break;
    case "otp":
      InputOption = Input.OTP;
      break;
    default:
      InputOption = Input;
  }
  return (
    <Form.Item
      validateStatus={error ? "error" : ""}
      help={error?.message}
      style={{paddingBottom: 4}}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <InputOption
            prefix={prefix}
            {...field}
            placeholder={placeholder}
            className={className}
            autoComplete={autoComplete}
            size={size}
            style={style}
            length={length}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        )}
      />
    </Form.Item>
  );
};

export default InputField;
