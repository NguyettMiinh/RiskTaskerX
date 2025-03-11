import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller } from "react-hook-form";
import { Flex, Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
import "../../styles/login.css";
import Logo from "../../assets/images/logo.png";

// Schema validation
const resetPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Please enter your email"),
});

export default function ForgotPasswordForm() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });
  const onSubmit = (data) => console.log(data);

  return (
    <section className="login-page-section">
      <Flex gap="middle" vertical>
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
              Forgot password
            </div>
            <div
              style={{
                color: "rgba(99, 99, 100, 1)",
              }}
            >
              Do not worry! We will help you recover your password
            </div>
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

          <Form.Item>
            <Link to="/otppage">
              <Button
                type="primary"
                htmlType="submit"
                block
                className="btn-sign-in"
              >
                Continue
              </Button>
            </Link>
          </Form.Item>
        </Form>
      </Flex>
    </section>
  );
}
