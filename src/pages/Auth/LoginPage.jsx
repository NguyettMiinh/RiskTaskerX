import React,{useState} from "react";
import { useForm} from "react-hook-form";
import { Link, useNavigate} from "react-router";
import { Controller } from "react-hook-form";
import { Flex, Checkbox, Form} from "antd";
import "@assets/styles/auth.css";
import "@assets/styles/common.css";
import { loginApi } from "@/services/userService";
import Logo from "@/assets/images/logo.png";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import ButtonComponent from "@components/ui/ButtonComponent";
import InputField from "@components/ui/InputField";


const LoginPage = () => {

  const [loginError, setLoginError] = useState("");

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    }
  });

 const navigate = useNavigate();
///---------API----------------------
  const onSubmit = async (data) => {
    setLoginError("");
    try {
      const response =  await loginApi(data.email, data.password);
      console.log(data.password);
      const token = response.data.results.token;
      localStorage.setItem("authToken", token);
      navigate("/dashboard");
      console.log("Login successful");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setLoginError("Invalid email or password. Please try again.");
    }
  };
  



  return (
    <Flex justify="center" align="center" style={{height: "100vh"}} className="cm-bg">
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
          <div className="title">
            Log In
          </div>

            <InputField
              name="email"
              control={control}
              prefix={<UserOutlined/>}
              placeholder= "Enter your email"
              autoComplete= "email"
              className="cm-input"
              error={errors.email}
            />

  
            <InputField
              name="password"
              control={control}
              prefix={<LockOutlined/>}
              placeholder= "********"
              autoComplete= "current-password"
              className="cm-input"
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
          {loginError && <p style={{ color: "red", marginBottom: "10px", textAlign: "center" }}>{loginError}</p>}
          <Form.Item className="cn-btn">
            <ButtonComponent
             htmlType="submit" 
             disabled={isSubmitting} 
             className = "cm-btn"
              block 
              content= {isSubmitting ? "Logging in..." : "Log In"} />
          </Form.Item>
        </Form>
      </div>
    </Flex>
  );
};

export default LoginPage;
