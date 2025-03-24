import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Flex, Form, Dropdown } from "antd";
import "@assets/styles/common.css";
import Logo from "@assets/images/logo.png";
import ButtonComponent from "@components/ui/ButtonComponent";
import InputField from "@components/ui/InputField";
import { useNavigate } from "react-router";
import { resetPassWordApi } from "@/services/userService";
import { useSelector } from "react-redux"; 
import { getPasswordRules } from "@/utils/passwordRules";
import { resetSchema } from "@/validations/resetSchema";


const ResetPage = () => {
  const email = useSelector((state) => state.user.email);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    
  } = useForm({
    resolver: yupResolver(resetSchema, { abortEarly: false }),
    mode: "onChange"

  });
  const passwordValue = watch("password") || ""; 
  const items = getPasswordRules(passwordValue);
  
    useEffect(() => {
      setDropdownOpen(passwordValue.length > 0);
    }, [passwordValue]);

  const handleLogin = () => {
    navigate("/login");   
};

let navigate = useNavigate();

const onSubmit = async (data) => {
  try {
    await resetPassWordApi(email, data.password, data.confirmPassword);
    navigate("/login");
    console.log("Password reset successful");
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
  console.log(email,data);
};

  return (
    <Flex justify="center" align="center" style={{ height: "100vh" }}>
      {isSubmitting && <div className="overlay"></div>}
      <div className="common-form">
        <Form
          className="login-form"
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
              Reset password
            </div>
            <div className="sub-title">
              Enter your new password below to reset your account.
            </div>
          </div>

            <Dropdown
              menu={{ items }}
              placement="bottom"
              open={dropdownOpen} 
              trigger={["click"]}
            >
              <div
                onFocus={() => setDropdownOpen(true)} 
                onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
              >
                <InputField
                   name="password"
                   control={control}
                   placeholder="New password"
                   autoComplete="new-password"
                   className="cm-input"
                   error= {errors.password}
                />
              </div>
            </Dropdown>

             

          <InputField
            name="confirmPassword"
            control={control}
            placeholder="Confirm password"
            autoComplete="confirm-password"
            className="cm-input"
            error={errors.confirmPassword}
          />

          <Form.Item className="cn-btn">
            <ButtonComponent
              className="cm-btn"
              content="Submit"
              htmlType="submit"
              block
              disabled={isSubmitting}
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
};

export default ResetPage;

