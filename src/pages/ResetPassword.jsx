import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Flex, Form, } from "antd";
import "../styles/reset.css";
import Logo from "../assets/images/logo.png";
import ButtonComponent from "../components/ButtonComponent";
import InputField from "../components/InputField";

// Schema validation
const resetSchema = yup.object().shape({
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Please enter your password"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords do not match")
      .required("Please confirm your password"),
  });

const ResetPassword = () => {
    const {
        handleSubmit,
        control,
        formState: { errors },
      } = useForm({
        resolver: yupResolver(resetSchema),
      });

const onSubmit = (data) => {
  console.log(data)
}
  return (
    <Flex justify="center" align="center" style={{height: "100vh"}}>
      <div className="auth-form">
        <Form
          className="login-form"
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          <div className="form-image">
            <img src={Logo} alt="Logo" />
          </div>
          <div
            style={{
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "30px",
                fontWeight: 700,
              }}
            >
              Reset Password
            </div>
            <div
              style={{
                color: "rgba(99, 99, 100, 1)",
              }}
            >
                Enter your new password below to reset your account.
            </div>
          </div>

          
          <Form.Item> 
            <InputField
              name="password"
              control={control}
              placeholder= "New password"
              autoComplete= "new-password"
              className="password-input"
              error={errors.password}
            />
          </Form.Item>
          <Form.Item> 
            <InputField
              name="confirm"
              control={control}
              placeholder= "Confirm password"
              autoComplete= "confirm-password"
              className="password-input"
              error={errors.confirmPassword}
            />
          </Form.Item>
  
          <Form.Item>
            <ButtonComponent className="btn-reset" content="sign In" htmlType="submit" block/>
          </Form.Item>
        </Form>
      </div>
    </Flex>
  );
};

export default ResetPassword;
