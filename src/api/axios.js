import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    
  });

instance.interceptors.request.use(
    function (config) {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers["Authorization"] = 'Bearer ' + token;
      }
      console.log("config",config);
    return config;
  }, function (error) {
    return Promise.reject(error);
  }); 
  
  instance.interceptors.response.use(  
    response => response,
   
    error => {
    if (error.response?.status === 401) {
      console.log("Unauthorized");
      window.location.href = '/login';
     
    }
  }, function (error) {
    return Promise.reject(error);
  });

export default instance;