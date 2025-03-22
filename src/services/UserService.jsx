import axios from "../config/axios";

const loginApi = async (email, password) => {
    return axios.post("/auth/sign-in", { email, password });
}

const otpApi = async (email,options = {}) => {
    return axios.get("/otp-api/email/send-otp",
      { params: { to: email } });
};

const verifyOtpApi = async (email,otp) => {
    return axios.post("/otp-api/email/verify-otp",{email,otp});
}

const resetPassWordApi = async (email, newPassword, reNewPassword) => {
    return axios.put("/otp-api/email/forgot-password", {email, newPassword, reNewPassword });
}

const getUserProfile = async () => {
    const token = localStorage.getItem("authToken");
  
    return axios.get("/api/profile");
  };

  const changePasswordApi = async ({oldPassword, newPassword, confirmPassword}) => {

    const token = localStorage.getItem("authToken"); 
    console.log(token);
    console.log(oldPassword, newPassword, confirmPassword)
    return axios.put(
      "/auth/change-password",
      { oldPassword, newPassword, confirmPassword }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
  };
  
export { loginApi, otpApi, verifyOtpApi, resetPassWordApi, getUserProfile, changePasswordApi };  
