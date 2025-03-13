import React from "react";
import { Controller } from "react-hook-form";
import { Input } from "antd";
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
}) => {
  let InputOption;
  switch (name) {
    case "password":
      InputOption = Input.Password;
      break;
    case "otp":
      InputOption = Input.OTP;
      break;
    default:
      InputOption = Input;
  }
  return (
    <div>
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
          />
        )}
      />
      {error && (
        <div>
          <span
            style={{
              color: "red",
            }}
          >
            {error.message}
          </span>
        </div>
      )}
    </div>
  );
};

export default InputField;
