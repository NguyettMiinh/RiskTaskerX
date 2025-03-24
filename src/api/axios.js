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
    return config;
  }, function (error) {
    return Promise.reject(error);
  }); 
  
  instance.interceptors.response.use(
    //Trả về response bình thường khi không có lỗi
    response => response,
    //Nếu lỗi 401 (Unauthorized), chuyển hướng về trang đăng nhập
    error => {
    if (error.response?.status === 401) {
      console.log("Unauthorized");
      window.location.href = '/login';
     
    }
  }, function (error) {
    return Promise.reject(error);
  });

export default instance;