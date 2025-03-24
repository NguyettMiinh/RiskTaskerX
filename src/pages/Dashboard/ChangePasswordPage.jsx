import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Flex, Form, Modal, Dropdown } from "antd";
import "@assets/styles/common.css";
import ButtonComponent from "@components/ui/ButtonComponent";
import InputField from "@components/ui/InputField";
import { LockOutlined } from "@ant-design/icons";
import { changePasswordApi } from "@/services/userService";
import { useSelector } from "react-redux";
import { getPasswordRules } from "@/utils/passwordRules";
import { changeSchema } from "@/validations/changeSchema";


const ChangePassword = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const storedPassword = useSelector((state) => state.user.password);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(changeSchema(storedPassword), { abortEarly: false }),
    mode: "onChange",
  });

  const passwordValue = watch("password") || "";
  const items = getPasswordRules(passwordValue);

  useEffect(() => {
    setDropdownOpen(passwordValue.length > 0);
  }, [passwordValue]);

  const showSuccess = () => {
    Modal.success({
      title: "Password Changed Successfully!",
    });
  };

  const onSubmit = async (data) => {
    console.log(data.currentPassword);
    const payload = {
      oldPassword: data.currentPassword,
      newPassword: data.password,
      confirmPassword: data.confirmPassword,
    };

    try {
      await changePasswordApi(payload);
      showSuccess();
      reset();
    } catch (error) {
      console.error(
        "Error changing password:",
        error.response?.data || error.message
      );
      alert("Failed to change password. Please try again.");
    }
  };

  return (
    <div
      style={{
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Flex justify="center" align="center" style={{ width: "100%" }}>
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
              <LockOutlined style={{ fontSize: "50px", color: "#6055F2" }} />
            </div>
            <div className="ct-title">
              <div className="cm-title">Change password</div>
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
              error={errors.currentPassword}
            />
            
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
                  error={errors.password}
                />
              </div>
            </Dropdown>

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
                block
                disabled={isSubmitting}
              />
            </Form.Item>
          </Form>
        </div>
      </Flex>
    </div>
  );
};

export default ChangePassword;
