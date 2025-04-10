import LayoutDefault from "@/layout/Layout";
import ForgotPasswordForm from "@/pages/auth/ForgotPage";
import LoginPage from "@/pages/auth/LoginPage";
import OtpPage from "@/pages/auth/OtpPage";
import ResetPage from "@/pages/auth/ResetPage";
import AdminManagementList from "@/pages/Dashboard/AdminManagementList";
import CustomerList from "@/pages/dashboard/CustomerList";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import DetailCustomer from "@/pages/dashboard/DetailCustomer";
import AddRole from "@/pages/Dashboard/Roles/AddRole";
import DetailRole from "@/pages/Dashboard/Roles/DetailRole";
import RoleList from "@/pages/Dashboard/Roles/RoleList";



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
          { path: 'customer', element: <CustomerList /> ,breadcrumb: "Customer Management"},
          {path: 'detail', element: <DetailCustomer /> , breadcrumb: "Customer Details"},
          {path: 'admin', element: <AdminManagementList />, breadcrumb: "Admin Acount List"},
          {path: 'admin/detail/:id', element: <AdminManagementList />, breadcrumb: "Detail"},
          {path: 'role-list', element: <RoleList />, breadcrumb: "Role Management"},
          {path: 'role-list/add-role', element: <AddRole />, breadcrumb: "Add New Role"},
          {path: 'role-list/role-detail', element: <DetailRole/>, breadcrumb: "Role Detail"}

        ]
    }
      
]

export default routes;