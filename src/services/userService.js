import axios from "@/api/axios";

const loginApi = async (email, password) => {
    return axios.post("/auth/sign-in", { email, password });
}

const otpApi = async (email) => {
    return axios.get("/otp/email/send",
      { params: { to: email } });
};

const verifyOtpApi = async (email,otp) => {
    return axios.post("/otp/email/verify",{email,otp});
}

const resetPassWordApi = async (email, newPassword, reNewPassword) => {
    return axios.put("/otp/email/forgot-password", {email, newPassword, reNewPassword });
}

const getUserProfile = async () => {
    const token = localStorage.getItem("authToken");
  
    return axios.get("/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const changePasswordApi = async ({oldPassword, newPassword, confirmPassword}) => {
    const token = localStorage.getItem("authToken"); 
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
