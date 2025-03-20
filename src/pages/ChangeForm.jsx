import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Flex, Form, Card } from "antd";
import "../styles/common.css";
import ButtonComponent from "../components/ButtonComponent";
import InputField from "../components/InputField";
import { useNavigate } from "react-router";
import { LockOutlined} from "@ant-design/icons";
// Schema validation
const resetSchema = yup.object().shape(
  {
    password: yup
    .string()
    .required("Please enter your password")
    .min(8, "")
    .test("no-spaces", "", (value) => !value || !/\s/.test(value))
    .test("uppercase", "", (value) => !value || /[A-Z]/.test(value))
    .test("number", "", (value) => !value || /[0-9]/.test(value))
    .test("special-char", "", (value) => !value || /[@$!%*?&]/.test(value)),
      
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords do not match")
      .required("Please confirm your password"),
  },
  { abortEarly: false }
);


const ChangeForm = () => {
  const [showCard, setShowCard] = useState(false);
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
    
  } = useForm({
    resolver: yupResolver(resetSchema, { abortEarly: false }),
    mode: "onChange"

  });
  const passwordValue = watch("password") || ""; 

  useEffect(() => {
    if (passwordValue) {
      setShowCard(true);
    }
  }, [passwordValue]);

  const onSubmit = (data) => {
    console.log(data);
  };

let navigate = useNavigate();

const handleGoReset = handleSubmit((data) => {
  navigate('/dashboard'); 
  console.log(data);
});
  return (
    <Flex justify="center" align="center" style={{ height: "100vh" }}>
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
            {<LockOutlined />}
          </div>
          <div className="ct-title">
            <div className="cm-title">
              Change password
            </div>
            <div className="sub-title">
              Set a new password to secure your account.
            </div>
          </div>

          <InputField
                name="currentPassword"
                control={control}
                placeholder="Currnet password "
                autoComplete="current-password"
                className="cm-input"
                // error= {errors.password}
              />


              <InputField
                name="password"
                control={control}
                placeholder="New password"
                autoComplete="new-password"
                className="cm-input"
                onFocus={() => {
                  if (passwordValue) setShowCard(true);
                }}
                onBlur={() => setTimeout(() => setShowCard(false), 500)}
                error= {errors.password}
              />
   
        
       
        {showCard && (
          <Card>
            <div>Password must include:</div>
            <ul>
              <li style={{ color: passwordValue.length >= 8 ? "black" : "red" }}>
                At least 8 characters
              </li>
              <li style={{ color: !/\s/.test(passwordValue) ? "black" : "red" }}>
                No spaces allowed
              </li>
              <li style={{ color: /[A-Z]/.test(passwordValue) ? "black" : "red" }}>
                At least one uppercase letter
              </li>
              <li style={{ color: /[0-9]/.test(passwordValue) ? "black" : "red" }}>
                At least one number
              </li>
              <li style={{ color: /[@$!%*?&]/.test(passwordValue) ? "black" : "red" }}>
                At least one special character (@$!%*?&)
              </li>
            </ul>
          </Card>
        )}

          <InputField
            name="confirmPassword"
            control={control}
            placeholder="Confirm new password"
            autoComplete="confirm-password"
            className="cm-input"
            error={errors.confirmPassword}
          />

          <Form.Item className="cn-btn">
            <ButtonComponent
              className="cm-btn"
              content="Change password"
              htmlType="submit"
              onClick={handleGoReset} 
              block
            />
          </Form.Item>
        </Form>
      </div>
    </Flex>
  );
};

export default ChangeForm;

