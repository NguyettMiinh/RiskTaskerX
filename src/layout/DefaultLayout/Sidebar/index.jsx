import React from "react";
import "@assets/styles/dashboard.css";
import {
  Layout,
  Menu,
} from "antd";
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
} from "@ant-design/icons";

const { Sider } = Layout;


const Sidebar = () => {

  const items = [
    { key: "1", icon: <BarChartOutlined />, label: "Dashboard" },
    { key: "2", icon: <SafetyOutlined />, label: "User Roles & Permissions" },
    { key: "3", icon: <UsergroupAddOutlined />, label: "Customer Management" },
    { key: "4", icon: <CarOutlined />, label: "Car Management" },
    { key: "5", icon: <ToolOutlined />, label: "Spare Parts Management" },
    {
      key: "6",
      icon: <NotificationOutlined />,
      label: "Marketing Campaign Management",
    },
    { key: "7", icon: <ShoppingCartOutlined />, label: "Order Management" },
    { key: "8", icon: <ApartmentOutlined />, label: "Branch Management" },
    { key: "9", icon: <MessageOutlined />, label: "Notification Management" },
  ];
 

  return (
    <>
       <Sider 
        style={{
          background: "#1E4C8F",
          
        }}
        width = {327}
      >
        <div style={{
          color: "white",
          fontSize: "30px",
          paddingLeft: "20px",
          paddingBottom: "10px",
        }}>MENU</div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          style={{ background: "inherit", paddingTop: 10 }}
        />
      </Sider>

    </>

  );
};
export default Sidebar;
