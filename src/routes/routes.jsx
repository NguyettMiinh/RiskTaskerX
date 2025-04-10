import LayoutDefault from "@/layout/Layout";
import ForgotPasswordForm from "@/pages/auth/ForgotPage";
import LoginPage from "@/pages/auth/LoginPage";
import OtpPage from "@/pages/auth/OtpPage";
import ResetPage from "@/pages/auth/ResetPage";
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
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'customer', element: <CustomerList /> },
          {path: 'detail', element: <DetailCustomer />},
          {path: 'role-list', element: <RoleList />},
          {path: 'add-role', element: <AddRole />},
          {path: 'role-detail', element: <DetailRole/>}
          
        ]
    }
      
]

export default routes;