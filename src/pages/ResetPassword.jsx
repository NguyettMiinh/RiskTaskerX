import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller } from "react-hook-form";
import { Flex, Checkbox, Form, Input } from "antd";
import "../styles/auth.css";
import Logo from "../assets/images/logo.png";
import Button from "../components/ButtonComponent";
import ButtonComponent from "../components/ButtonComponent";
import InputComponent from "../components/InputComponent";
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
  const onSubmit = (data) => console.log(data);

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

          
          <Form.Item
            validateStatus={errors.password ? "error" : ""}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <InputComponent.Password
                  size="large"
                  {...field}
                  placeholder="New password"
                  className="form-input"
                  autoComplete="current-password"
                  
                />
              )}
              
            />
          </Form.Item>

          <Form.Item
            validateStatus={errors.password ? "error" : ""}
            help={errors.password?.message}
          >
            <Controller
              name="confirm"
              control={control}
              render={({ field }) => (
                <Input.Password
                size="large"
                  {...field}
                  placeholder= "Confirm password"
                  className="form-input"
                  autoComplete="current-password"
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <ButtonComponent content="sign In"/>
          </Form.Item>
        </Form>
      </div>
    </Flex>
  );
};

export default ResetPassword;
