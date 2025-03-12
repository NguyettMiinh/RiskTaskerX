import React from 'react';
import { Routes, Route} from 'react-router';
import LoginPage from './pages/LoginPage';
import ForgotPasswordForm from './pages/ForgotPage';
import OtpPage from './pages/OtpPage';


const App = () =>{
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/password" element={<ForgotPasswordForm/>} />
        <Route path="/otppage" element={<OtpPage/>} />
      </Routes>
    </div>
  );
}

export default App
