import LayoutDefault from "@/layout/Layout";
import ForgotPasswordForm from "@/pages/auth/ForgotPage";
import LoginPage from "@/pages/auth/LoginPage";
import OtpPage from "@/pages/auth/OtpPage";
import ResetPage from "@/pages/auth/ResetPage";
import AdminManagementList from "@/pages/Dashboard/AdminManagementList";
import CustomerList from "@/pages/dashboard/CustomerList";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import DetailCustomer from "@/pages/dashboard/DetailCustomer";

const routes = [
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/forgot",
        element: <ForgotPasswordForm />,
    },
    {
        path: "/otp",
        element: <OtpPage/>,
    },
    {
        path: "/reset",
        element: <ResetPage />,
    },
    {
        path: "/layout",
        element: <LayoutDefault />,
        breadcrumb: "Home",
        children: [
          { path: 'dashboard', element: <DashboardPage /> , breadcrumb: "Dashboard"},
          { path: 'customer', element: <CustomerList /> ,breadcrumb: "Customer"},
          {path: 'detail', element: <DetailCustomer /> , breadcrumb: "Detail"},
          {path: 'admin', element: <AdminManagementList />, breadcrumb: "Admin Acount List"},
          {path: 'admin/detail/:id', element: <AdminManagementList />, breadcrumb: "Detail"},
        ]
    }
      
]

export default routes;