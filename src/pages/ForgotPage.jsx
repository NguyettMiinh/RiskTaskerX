import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Flex, Form } from "antd";
import "../styles/common.css";
import Logo from "../assets/images/logo.png";
import { UserOutlined, CloseOutlined } from "@ant-design/icons";
import ButtonComponent from "../components/ButtonComponent";
import InputField from "../components/InputField";
import { useNavigate } from "react-router";

// Schema validation
const forgotPasswordSchema = yup.object().shape({
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
    resolver: yupResolver(forgotPasswordSchema),
  });
  let navigate = useNavigate();

  const handleGoOTP = handleSubmit((data) => {
    navigate("/otppage");
    console.log(data);
  });
  const handleLogin = () => {
    navigate("/");
  };
  return (
    <Flex justify="center" align="center" style={{ height: "100vh" }}>
      <div className="common-form">
        <Form
          className="login-form"
          name="basic"
          initialValues={{
            remember: true,
          }}
          autoComplete="off"
        >
          <Form.Item>
            <ButtonComponent
              icon={<CloseOutlined  style={{ color: "#333" }} />}
              className="no-hover-effect"
              onClick={handleLogin}
            ></ButtonComponent>
          </Form.Item>

          <div className="cm-image">
            <img src={Logo} alt="Logo" className="cm-img" />
          </div>
          
          <div className="ct-title">
            <div className="cm-title">Forgot password</div>
            <div className="sub-title">
              Do not worry! We will help you recover your password
            </div>
          </div>

          <InputField
            name="email"
            control={control}
            prefix={<UserOutlined />}
            placeholder="Enter your email"
            autoComplete="email"
            className="cm-input"
            error={errors.email}
          />
          
          <Form.Item className="cn-btn">
            <ButtonComponent
              block
              className="cm-btn"
              onClick={handleGoOTP}
              htmlType="submit"
              content="Continue"
            />
          </Form.Item>
        </Form>
      </div>
    </Flex>
  );
}
