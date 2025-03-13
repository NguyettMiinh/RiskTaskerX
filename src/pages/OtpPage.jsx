import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Flex, Form } from "antd";
import Logo from "../assets/images/logo.png";
import "../styles/otp.css";
import ButtonComponent from "../components/ButtonComponent";
import InputField from "../components/InputField";
import { useNavigate } from "react-router";

// Schema validation
const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .matches(/^\d{4}$/, "Invalid OTP format")
    .required("Please enter your OTP."),
});

export default function OtpPage() {
  const [time, setTime] = useState(10);
  const [resend, setResend] = useState(false);
  const [timer, setTimer] = useState(30);
  const [timeResend, setTimeResend] = useState(false);
  useEffect(() => {
    if (time > 0) {
      const timeId = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timeId);
    } else {
      setResend(true);
    }
  }, [time]);

  useEffect(() => {
    if (timer > 0) {
      const timeId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timeId);
    } else {
      setTimeResend(false);
    }
  }, [timer]);

  const handleResend = () => {
    setTimer(30);
    setResend(false);
    setTimeResend(true);
    console.log("Resending OTP...");
  };
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(otpSchema),
  });
  let navigate = useNavigate();

  const handleGoReset = handleSubmit((data) => {
    navigate('/reset-password'); 
    console.log(data);
});
  
  return (
    <Flex
      justify="center"
      align="center"
      style={{
        height: "100vh",
      }}
    >
      <div className="auth-form-3">
        <Form
          className="login-form "
          name="basic"
          initialValues={{
            remember: true,
          }}
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
              OTP Verification
            </div>
            <div
              style={{
                color: "rgba(99, 99, 100, 1)",
              }}
            >
              Enter the OTP sent to your email
            </div>
          </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <InputField
                name="otp"
                control={control}
                className="email-input"
                error={errors.otp}
                length={4}
                style={{
                  height: 40,
                  width: 300,
                }}
              />
            </div>

          <div className="resend-otp">
            {resend && (
              <div>
                Didn't receive the code?
                <a onClick={handleResend}>Re-send</a>
              </div>
            )}

            {timeResend && <div>Resend {timer}...</div>}
          </div>

          <Form.Item>
            <ButtonComponent
              className="btn-otp"
              onClick={handleGoReset} 
              content="Continue"
              htmlType="submit"
            />
          </Form.Item>
        </Form>
      </div>
    </Flex>
  );
}
