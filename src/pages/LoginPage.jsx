import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller } from "react-hook-form";
import { Flex, Checkbox, Form, Input } from "antd";
import "../styles/auth.css";
import Logo from "../assets/images/logo.png";
import Button from "../components/Button";
// Schema validation
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&]/,
      "Password must contain at least one special character (@$!%*?&)"
    ),
});

const LoginPage = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
    resolver: yupResolver(loginSchema),
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
              fontSize: "30px",
              fontWeight: 700,
            }}
          >
            Sign in
          </div>
          <Form.Item
            validateStatus={errors.email ? "error" : ""}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter your email"
                  className="form-input"
                  autoComplete="email"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            validateStatus={errors.password ? "error" : ""}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder="********"
                  className="form-input"
                  autoComplete="current-password"
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <div className="form-bottom">
              <Controller
                name="remember"
                control={control}
                render={({ field }) => (
                  <Checkbox {...field} checked={field.value}>
                    Remember me
                  </Checkbox>
                )}
              />
              <Link to="/password" className="forgot-link">
                Forgot password?
              </Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button content="sign In"/>
          </Form.Item>
        </Form>
      </div>
    </Flex>
  );
};

export default LoginPage;
