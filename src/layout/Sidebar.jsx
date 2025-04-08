import React from "react";
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

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();

  // Menu items
  const items = [
    { key: "1", icon: <BarChartOutlined />, label: "Dashboard", onClick: () => navigate("/layout/dashboard") },
    { key: "2", icon: <SafetyOutlined />, label: "User Roles & Permissions" },
    { key: "3", icon: <UsergroupAddOutlined />, label: "Customer Management", onClick: () => navigate("/layout/customer") },
    { key: "4", icon: <CarOutlined />, label: "Car Management" },
    { key: "5", icon: <ToolOutlined />, label: "Spare Parts Management" },
    { key: "6", icon: <NotificationOutlined />, label: "Marketing Campaign Management" },
    { key: "7", icon: <ShoppingCartOutlined />, label: "Order Management" },
    { key: "8", icon: <ApartmentOutlined />, label: "Branch Management" },
    { key: "9", icon: <MessageOutlined />, label: "Notification Management" },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      trigger={null}
      style={{
        position: "fixed",
        left: 0,
        bottom: 0,
        top: "60px",
        backgroundColor: "#001529",
        zIndex: 200,
        paddingTop: "5px",
      }}
      width={294}
    >
      {/* Custom Collapse Button */}
      <Button
        type="text"
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: "absolute",
          bottom: "10px",
          right: collapsed ? "20px" : "10px",
          backgroundColor: "#001529",
          color: "#fff",
          border: "none",
          zIndex: 300,
        }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>

      {/* Sidebar Menu */}
      <Menu
        theme="dark"
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={items}
        style={{ background: "inherit", paddingTop: 10 }}
      />
    </Sider>
  );
};

export default Sidebar;