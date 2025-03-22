import React,{useState} from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Flex, Form } from "antd";
import "../../assets/styles/common.css";
import Logo from "../../assets/images/logo.png";
import { UserOutlined, CloseOutlined } from "@ant-design/icons";
import ButtonComponent from "../../components/ui/ButtonComponent";
import InputField from "../../components/ui/InputField";
import { useNavigate } from "react-router";
import { otpApi } from "../../services/userService";
import { useDispatch } from "react-redux";
import { setEmail } from "../../redux/emailSlice";
// Schema validation
const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Please enter your email"),
});

export default function ForgotPasswordForm() {
   const [loginError, setLoginError] = useState("");
   const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });
  let navigate = useNavigate();;
  const [isCancelled, setIsCancelled] = useState(false);

  const handleLogin = () => {
    navigate("/login");
  };
  //---------Redux----------------------
  const emailValue = watch("email");
  React.useEffect(() => {
    if (emailValue) {
      dispatch(setEmail(emailValue));
    }
  }, [emailValue, dispatch]);
    ///---------API----------------------
    const onSubmit = async (data) => {

      setLoginError("");
      try {
        await otpApi(data.email);
        navigate("/otppage");
        
      } catch (error) {
          console.error("Error:", error.response?.data || error.message);
          setLoginError("Invalid email. Please try again.");

      }
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
          onFinish={handleSubmit(onSubmit)}
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
          {loginError && <p style={{ color: "red", marginBottom: "10px", textAlign: "center" }}>{loginError}</p>}
          <Form.Item className="cn-btn">
            <ButtonComponent
              block
              className="cm-btn"
              htmlType="submit"
              content="Continue"
            />
          </Form.Item>
        </Form>
      </div>
    </Flex>
  );
}
