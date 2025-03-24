import axios from "@/api/axios";

const loginApi = async (email, password) => {
    
    return axios.post("/auth/sign-in", { email, password });
}

const otpApi = async (email) => {
    return axios.get("/otp/email/send",
      { params: { to: email } });
};

const verifyOtpApi = async (email,otp) => {
  const loginRequest = {
    email: email,
    otp: otp,
  };
  return axios.post("/otp/email/verify",{...loginRequest});
}

const resetPassWordApi = async (email, newPassword, reNewPassword) => {
  const resetRequest = {
    email: email,
    newPassword: newPassword,
    reNewPassword: reNewPassword,
  };
    return axios.put("/otp/email/forgot-password", {...resetRequest});
}

const getUserProfile = async () => { 
    return axios.get("/api/profile");
  };

  const changePasswordApi = async ({oldPassword, newPassword, confirmPassword}) => {
    return axios.put("/auth/change-password",
      {oldPassword,newPassword,confirmPassword}
      
    );
    
  };
  
export { loginApi, otpApi, verifyOtpApi, resetPassWordApi, getUserProfile, changePasswordApi };  
