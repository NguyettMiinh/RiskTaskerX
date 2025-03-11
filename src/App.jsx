import React from 'react';
import { Routes, Route} from 'react-router';
import LoginPage from './components/pages/LoginPage';
import ForgotPasswordForm from './components/pages/ForgotPage';


const App = () =>{
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/password" element={<ForgotPasswordForm/>} />
      </Routes>
    </div>
  );
}

export default App
