import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router";
import { Controller } from "react-hook-form";
import { Flex, Form, Input} from "antd";
import Logo from "../assets/images/logo.png";
import "../styles/otp.css";
import ButtonComponent from "../components/ButtonComponent";

// Schema validation
const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .matches(/^\d{4}$/, "OTP is incorrect. Please try again.")
    .required("Please enter your OTP. "),
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
  const onSubmit = (data) => console.log(data);

  return (
    <Flex justify="center" align="center"
       style={{ 
        height: "100vh"}}>
      <div className="auth-form-3">
        <Form
          className="login-form "
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

          <Form.Item
            validateStatus={errors.otp ? "error" : ""}
            help={errors.otp?.message}
          >
            <div>
              <Controller
                name="otp"
                control={control}
                render={({ field }) => (
                  <Input.OTP
                    size="large"
                    length={4}
                    {...field}
                    
                    // style={{
                    //   width: "250px", 
                    //   minWidth: "200px",
                    //   textAlign: "center",
                    //   flex: "0 0 auto", 
                    // }}
                  />
                )}
              />
            </div>
          </Form.Item>

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
            <ButtonComponent content="Continue"/>
          </Form.Item>
        </Form>
      </div>
       
      </Flex>
  );
}
