import "@assets/styles/dashboard.css";
import { Layout, Menu, Button } from "antd";
import {
  BarChartOutlined,
  UsergroupAddOutlined,
  CarOutlined,
  ToolOutlined,
  NotificationOutlined,
  ShoppingCartOutlined,
  ApartmentOutlined,
  MessageOutlined,
  SafetyOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";

const { Sider } = Layout;
function getItem(label, key, icon, children, onClick) {
  return {
    key,
    icon,
    children,
    label,
    onClick,
  };
}
const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();

  // Menu items
  const items = [
    getItem("Dashboard", "1", <BarChartOutlined />, null, () =>
      navigate("/layout/dashboard")
    ),
    getItem("User Roles & Permissions", "ad", <SafetyOutlined />, [
      getItem("Admin Management", "2", null, null, () =>
        navigate("/layout/admin")
      ),
      getItem("Role Management", "3", null, null, () =>
        navigate("/layout/role-list")
      ),
    ]),
    getItem("Customer Management", "4", <UsergroupAddOutlined />, null, () =>
      navigate("/layout/customer")
    ),
    getItem("Car Management", "5", <CarOutlined />),
    getItem("Spare Parts Management", "6", <ToolOutlined />),
    getItem("Marketing Campaign Management", "7", <NotificationOutlined />),
    getItem("Order Management", "8", <ShoppingCartOutlined />),
    getItem("Branch Management", "9", <ApartmentOutlined />),
    getItem("Notification Management", "10", <MessageOutlined />),
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      trigger={null}
      className="fixed left-0 bottom-0 top-[60px] bg-[#001529] z-[200] pt-[5px]"
      width={290}
    >
      {/* Custom Collapse Button */}
      <Button
        type="text"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute bottom-[10px] right-[10px] bg-[#001529] text-white border-none z-[300]"
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>

      {/* Sidebar Menu */}
      <Menu
        theme="dark"
        mode="inline"
        items={items}
        style={{ background: "inherit", paddingTop: 10 }}
      />
    </Sider>
  );
};

export default Sidebar;
