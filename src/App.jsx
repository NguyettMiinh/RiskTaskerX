import React from 'react';
import { Routes, Route} from 'react-router';
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import LoginPage from '@pages/auth/LoginPage';
import ForgotPasswordForm from '@pages/auth/ForgotPage';
import OtpPage from '@pages/auth/OtpPage';
import ResetPassword from '@pages/auth/ResetPassword';
import DashboardPage from '@pages/dashboard/DashboardPage';
import ChangePassword from '@pages/dashboard/ChangePasswordPage'




const App = () =>{
  return (
    <div>
      <Provider store={store}>
        <Routes>
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/password" element={<ForgotPasswordForm/>} />
          <Route path="/otppage" element={<OtpPage/>} />
          <Route path="/reset-password" element={<ResetPassword/>} />
          <Route path="/dashboard" element={<DashboardPage/>} />
          <Route path="/change-password" element={<ChangePassword/>} />
        </Routes>
      </Provider>
    </div>
  );
}

export default App
