import axios from "../api/axios";

const loginApi = async (email, password) => {
    return axios.post("/auth/sign-in", { email, password });
}

export { loginApi };