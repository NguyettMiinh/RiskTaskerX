import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Flex, Form, Card } from "antd";
import "@assets/styles/common.css";
import ButtonComponent from "@components/ui/ButtonComponent";
import InputField from "@components/ui/InputField";
import { LockOutlined} from "@ant-design/icons";
import { changePasswordApi } from "@/services/userService";

// Schema validation
const resetSchema = yup.object().shape(
  {
    currentPassword: yup
    .string()
    .required("Please enter your current password"),
    password: yup
    .string()
    .required("Please enter your password")
    .min(8, "")
    .test("no-spaces", "", (value) => !value || !/\s/.test(value))
    .test("uppercase", "", (value) => !value || /[A-Z]/.test(value))
    .test("number", "", (value) => !value || /[0-9]/.test(value))
    .test("special-char", "", (value) => !value || /[@$!%*?&]/.test(value)),
      
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords do not match")
      .required("Please confirm your password"),
  },
  { abortEarly: false }
);


const ChangePassword = () => {
  const [showCard, setShowCard] = useState(false);
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors , isSubmitting},
    reset,
    
  } = useForm({
    resolver: yupResolver(resetSchema, { abortEarly: false }),
    mode: "onChange"

  });

  const passwordValue = watch("password") || ""; 

  useEffect(() => {
    if (passwordValue) {
      setShowCard(true);
    }
  }, [passwordValue]);



  const onSubmit = async (data) => {
    const payload = {
      oldPassword: data.currentPassword, // Mật khẩu hiện tại
      newPassword: data.password, // Mật khẩu mới
      confirmPassword: data.confirmPassword
    };
    console.log("Sending request:", payload);
  
    try {
      await changePasswordApi(payload);
      alert("Password changed successfully!");
      reset();
    } catch (error) {
      console.error("Error changing password:", error.response?.data || error.message);
      alert("Failed to change password. Please try again.");
    }
  };
  
  return (
    <div style={{
      alignItems: "center",
      justifyContent: "center",
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }}>
        <Flex justify="center" align="center" style={{ width: "100%"}}>
          <div className="common-form">
            <Form
              className="login-form"
              name="basic"
              initialValues={{
                remember: true,
              }}
              onFinish={handleSubmit(onSubmit)}
              autoComplete="off"
            >
              <div className="cm-image" >
                <LockOutlined style={{ fontSize: "50px", color: "#6055F2" }} />
              </div>
              <div className="ct-title">
                <div className="cm-title">
                  Change password
                </div>
                <div className="sub-title">
                  Set a new password to secure your account.
                </div>
              </div>

              <InputField
                    name="currentPassword"
                    control={control}
                    placeholder="Currnet password "
                    autoComplete="current-password"
                    className="cm-input"
                    error= {errors.currentPassword}
                  />


                  <InputField
                    name="password"
                    control={control}
                    placeholder="New password"
                    autoComplete="new-password"
                    className="cm-input"
                    onFocus={() => {
                      if (passwordValue) setShowCard(true);
                    }}
                    onBlur={() => setTimeout(() => setShowCard(false), 500)}
                    error= {errors.password}
                  />
      
            
          
            {showCard && (
              <Card>
                <div>Password must include:</div>
                <ul>
                  <li style={{ color: passwordValue.length >= 8 ? "black" : "red" }}>
                    At least 8 characters
                  </li>
                  <li style={{ color: !/\s/.test(passwordValue) ? "black" : "red" }}>
                    No spaces allowed
                  </li>
                  <li style={{ color: /[A-Z]/.test(passwordValue) ? "black" : "red" }}>
                    At least one uppercase letter
                  </li>
                  <li style={{ color: /[0-9]/.test(passwordValue) ? "black" : "red" }}>
                    At least one number
                  </li>
                  <li style={{ color: /[@$!%*?&]/.test(passwordValue) ? "black" : "red" }}>
                    At least one special character (@$!%*?&)
                  </li>
                </ul>
              </Card>
            )}

              <InputField
                name="confirmPassword"
                control={control}
                placeholder="Confirm new password"
                autoComplete="confirm-password"
                className="cm-input"
                error={errors.confirmPassword}
              />

              <Form.Item className="cn-btn">
                <ButtonComponent
                  className="cm-btn"
                  content="Change password"
                  htmlType="submit"
                  block
                  disabled={isSubmitting}
                />
              </Form.Item>
            </Form>
          </div>
        </Flex>

    </div>

  );
};

export default ChangePassword;

