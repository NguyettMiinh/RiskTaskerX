import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordForm from './pages/auth/ForgotPasswordForm';
import OtpPage from './pages/auth/OtpPage';
import ResetPassword from './pages/auth/ResetPassword';
import DashboardPage from './pages/dashboard/DashboardPage';
import ChangePassword from './pages/dashboard/ChangePasswordPage';

//khong can dang nhap van xem duoc
const publicRoutes  = [];

//phai dang nhap moi vao duoc: khong dang nhap se chuyen huong den login
const privateRoutes = [];

export {publicRoutes, privateRoutes};