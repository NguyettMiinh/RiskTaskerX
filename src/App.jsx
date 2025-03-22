import React from 'react';
import { Routes, Route} from 'react-router';
import { Provider } from "react-redux";
import { store } from "./redux/store";
import LoginPage from './pages/Auth/LoginPage';
import ForgotPasswordForm from './pages/Auth/ForgotPage';
import OtpPage from './pages/Auth/OtpPage';
import ResetPassword from './pages/Auth/ResetPassword';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ChangePassword from './pages/Dashboard/ChangePasswordPage';




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
