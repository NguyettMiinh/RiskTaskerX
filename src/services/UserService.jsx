import axios from "../api/axios";

const loginApi = async (email, password) => {
    return axios.post("/auth/sign-in", { email, password });
}

const otpApi = async (email) => {
    return axios.get("/otp-api/email/send-otp", { params: { to: email } });
};

const verifyOtpApi = async (email,otp) => {
    return axios.post("/otp-api/email/verify-otp",{email,otp});
}

const resetPassWordApi = async (email, newPassword, reNewPassword) => {
    return axios.put("/otp-api/email/forgot-password", {email, newPassword, reNewPassword });
}
export { loginApi, otpApi, verifyOtpApi, resetPassWordApi };