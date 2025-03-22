import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Flex, Form } from "antd";
import Logo from "@assets/images/logo.png";
import "@assets/styles/otp.css";
import "@assets/styles/common.css";
import ButtonComponent from "@components/ui/ButtonComponent";
import InputField from "@components/ui/InputField";
import { useNavigate } from "react-router";
import { otpApi, verifyOtpApi } from "@/services/userService";
import { useSelector } from "react-redux"; 
// Schema validation
const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .matches(/^\d{4}$/, "Invalid OTP format")
    .required("Please enter your OTP."),
});

export default function OtpPage() {
  const [loginError, setLoginError] = useState("");
  const [time, setTime] = useState(10);
  const [resend, setResend] = useState(false);
  const [timer, setTimer] = useState(30);
  const [timeResend, setTimeResend] = useState(false);
  const email = useSelector((state) => state.email.value);
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
  let navigate = useNavigate();
  const handleResend = async(data) => {
    setTimer(30);
    setResend(false);
    setTimeResend(true);
    console.log("Resending OTP...");
    try {
      await otpApi(email);
      console.log("Resend successful");
     } catch (error) {
       console.error("Error:", error.response?.data || error.message);
       setLoginError("Invalid email or password. Please try again.");
     }
  };
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(otpSchema),
  });
 


  const onSubmit = async (data) => {
    setLoginError("");
    try {
     await verifyOtpApi( email, data.otp );
      navigate("/reset-password");
      console.log("Login successful");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setLoginError("Invalid email or password. Please try again.");
    }
  };
  
  return (
    <Flex
      justify="center"
      align="center"
      style={{
        height: "100vh",
      }}
    >
      <div className="common-form">
        <Form
          className="login-form "
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          <div className="cm-image">
            <img src={Logo} alt="Logo" className="cm-img" />
          </div>

          <div className="ct-title">
            <div className="cm-title">
              OTP Verification
            </div>
            <div className="sub-title">
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
              <div className="sub-resend">
                Didn't receive the code?
                <a onClick={handleResend}>Re-send</a>
              </div>
            )}

            {timeResend && <div>Resend {timer}...</div>}
          </div>
          {loginError && <p style={{ color: "red", marginBottom: "10px", textAlign: "center" }}>{loginError}</p>}
          <Form.Item className="cn-btn">
            <ButtonComponent
              className="cm-btn otp-btn"
              content="Continue"
              htmlType="submit"
            />
          </Form.Item>
        </Form>
      </div>
    </Flex>
  );
}
