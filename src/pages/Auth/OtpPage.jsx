import React, { useState, useEffect, useLayoutEffect } from "react";
import { set, useForm } from "react-hook-form";
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
    .required(""),
});

export default function OtpPage() {
  const [loginError, setLoginError] = useState("");
  const [time, setTime] = useState(10);
  const [resend, setResend] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timeResend, setTimeResend] = useState(false);
  const email = useSelector((state) => state.user.email);

  let navigate = useNavigate();
  
  useEffect(() => {
    if (!email) {
      navigate("/login"); 
      
    }
  }, [email, navigate]);

  useEffect(() => {
    if (time > 0) {
      const timeId = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timeId);
    } else if (time === 0) {
      setResend(true);
    }
  }, [time]);

  useEffect(() => {
    if (timer > 0) {
      const timeId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timeId);
    } else if (timer === 0) {
      setTimeResend(false);
    }
  }, [timer]);

  
  const handleResend = async () => {
    setResend(false);
    setTimer(10);
    setTimeResend(true);
    setTime(20);
    console.log("Resending OTP...");
    try {
      await otpApi(email);
     } catch (error) {
       console.error("Error:", error.response?.data || error.message);
     }
  };

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(otpSchema),
  });
 
  const handleLogin = () => {
    navigate("/login");   
};

  const onSubmit = async (data) => {  
    setLoginError("");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
     const response = await verifyOtpApi(email, data.otp);
     if (response.data?.results?.success) {
      navigate("/reset-password");
      } else {


        setLoginError("OTP is incorrect!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <Flex
      justify="center"
      align="center"
      style={{
        height: "100vh",
      }}
      className="cm-bg"
    >
      {isSubmitting && <div className="overlay"></div>}
      
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
                className="otp-input"
                error={errors.otp}
                length={4}
              />
            </div>

          <div className="resend-otp">
            {resend && (
              <div className="sub-resend">
                Didn't receive the code?
                <a onClick={handleResend} style={{
                  paddingLeft: "5px",
                }}>Re-send</a>
              </div>
            )}

            {timeResend && <div style={{
                paddingBottom: "20px"
            }}>Resend in {timer}s...</div>}
          </div>
          {loginError && <p style={{ color: "red", marginBottom: "10px", textAlign: "center" }}>{loginError}</p>}
          <Form.Item className="cn-btn">
            <ButtonComponent
              className="cm-btn otp-btn"
              disabled={isSubmitting}
              content={isSubmitting ? "Verifying..." : "Continue"}
              htmlType="submit"
  
            />
          </Form.Item>
          <Form.Item style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxSizing: "border-box",
          }}>
            <div style={{
              color: "#636364",
              fontSize: 14,
            }}>Do you remember the password?
               <span>
                <ButtonComponent 
                className="sub-btn"
                onClick={handleLogin}
                content="Login" />
              </span>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Flex>
  );
}
