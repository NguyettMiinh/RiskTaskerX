import React from 'react';
import { Routes, Route} from 'react-router';
import LoginPage from './pages/LoginPage';
import ForgotPasswordForm from './pages/ForgotPage';
import OtpPage from './pages/OtpPage';
import ResetPassword from './pages/ResetPassword';
import DasboardPage from './pages/DasboardPage';
import { Provider } from "react-redux";
import { store } from "./redux/store";



const App = () =>{
  return (
    <div>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<LoginPage/>} />
          <Route path="/password" element={<ForgotPasswordForm/>} />
          <Route path="/otppage" element={<OtpPage/>} />
          <Route path="/reset-password" element={<ResetPassword/>} />
          <Route path="/dashboard" element={<DasboardPage/>} />
          {/* <Route path="/change-password" element={<ChangePassword/>} /> */}
        </Routes>
      </Provider>
    </div>
  );
}

export default App
