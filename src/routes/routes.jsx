import LayoutDefault from "@/layout/Layout";
import ForgotPasswordForm from "@/pages/auth/ForgotPage";
import LoginPage from "@/pages/auth/LoginPage";
import OtpPage from "@/pages/auth/OtpPage";
import ResetPage from "@/pages/auth/ResetPage";

import CustomerList from "@/pages/Dashboard/Customers/CustomerList";
import DashboardPage from "@/pages/Dashboard/Customers/DashboardPage";
import DetailCustomer from "@/pages/Dashboard/Customers/DetailCustomer";
import AddRole from "@/pages/Dashboard/Roles/AddRole";
import DetailRole from "@/pages/Dashboard/Roles/DetailRole";
import RoleList from "@/pages/Dashboard/Roles/RoleList";
import ChangePassword from "@/pages/Dashboard/Customers/ChangePasswordPage";
import AdminManagementList from "@/pages/Dashboard/Admins/AdminManagementList";



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
          {path: 'dashboard', element: <DashboardPage /> , breadcrumb: "Dashboard"},
          {path: 'change-password', element: <ChangePassword />},
          {path: 'customer', element: <CustomerList /> ,breadcrumb: "Customer Management"},
          {path: 'customer/detail/:id', element: <DetailCustomer /> , breadcrumb: "Customer Details"},
          {path: 'admin', element: <AdminManagementList />, breadcrumb: "Admin Acount List"},
          {path: 'admin/detail/:id', element: <AdminManagementList />, breadcrumb: "Detail"},
          {path: 'role-list', element: <RoleList />, breadcrumb: "Role Management"},
          {path: 'role-list/add-role', element: <AddRole />, breadcrumb: "Add New Role"},
          {path: 'role-list/role-detail', element: <DetailRole/>, breadcrumb: "Role Detail"}

        ]
    }
      
]

export default routes;