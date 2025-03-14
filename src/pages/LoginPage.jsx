import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller } from "react-hook-form";
import { Flex, Checkbox, Form} from "antd";
import "../styles/auth.css";
import Logo from "../assets/images/logo.png";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import ButtonComponent from "../components/ButtonComponent";
import InputField from "../components/InputField";


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
  const onSubmit = (data) => {
    console.log( 'data',data);
    
  };



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
              fontSize: "32px",
              fontWeight: 700,
              paddingBottom: 10,
            }}
          >
            Sign in
          </div>

            <InputField
              name="email"
              control={control}
              prefix={<UserOutlined/>}
              placeholder= "Enter your email"
              autoComplete= "email"
              className="email-input"
              error={errors.email}
            />

  
            <InputField
              name="password"
              control={control}
              prefix={<LockOutlined/>}
              placeholder= "********"
              autoComplete= "current-password"
              className="password-input"
              error={errors.password}
            />

          <Form.Item>
            <Flex justify="space-between" align="center">
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
            </Flex>
          </Form.Item>

          <Form.Item label={null}>
            <ButtonComponent
             htmlType="submit" className = "btn-sign-in" block content="sign in"/>
          </Form.Item>
        </Form>
      </div>
    </Flex>
  );
};

export default LoginPage;
