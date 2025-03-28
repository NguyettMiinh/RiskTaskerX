import axios from "axios";
import { toast } from "react-toastify";
const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    
  });

instance.interceptors.request.use(
    function (config) {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers["Authorization"] = 'Bearer ' + token;
      }
    return config;
  }, function (error) {
    return Promise.reject(error);
  }); 
  
  instance.interceptors.response.use(  
    response => response,
   
    error => {
      console.log(error);
    if (error.response?.status === 401) {
      console.log("Unauthorized");
      window.location.href = '/login';
     
    }
    if (error.response?.data.message === "password-matches-old-password") {
      toast.error("New password cannot be the same as the current password.");
    }
    if (error.response?.data.message === "invalid-username-or-password" ) {
      toast.error("The current password is incorrect. Please try again.");
    }
  }, function (error) {
    return Promise.reject(error);
  });

export default instance;