import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Flex, Form} from "antd";
import { Link } from "react-router-dom";
import "../styles/forgot.css";
import Logo from "../assets/images/logo.png";
import { UserOutlined } from '@ant-design/icons';
import ButtonComponent from "../components/ButtonComponent";
import InputField from "../components/InputField";


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
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });
  const onSubmit = (data) => console.log(data);

  return (
    <Flex justify="center" align="center" style={{height: "100vh"}}>
      <div className="auth-form-2">
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
                paddingBottom: 20,
              }}
            >
              Forgot password
            </div>
            <div
              style={{
                color: "rgba(99, 99, 100, 1)",
                paddingBottom: 22,
              }}
            >
              Do not worry! We will help you recover your password
            </div>
          </div>

          <Form.Item> 
            <InputField
              name="email"
              control={control}
              prefix={<UserOutlined/>}
              placeholder= "Enter your email"
              autoComplete= "email"
              className="email-input"
              error={errors.email}
            />
          </Form.Item>

          <Form.Item>
              <Link to ="/otppage">
                <ButtonComponent block disabled={isSubmitting}  htmlType="submit" content="Continue"/>
              </Link>
             
          </Form.Item>
        </Form>
      </div>
    </Flex>
  );
}
