import React,{useState} from "react";

import "@assets/styles/dashboard.css";
import {
  Layout,
  Menu,
  Button,
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
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from "@ant-design/icons";

import { useNavigate } from "react-router";

const { Sider } = Layout;


const Sidebar = ({ collapsed, setCollapsed}) => {

  const navigate = useNavigate();
  const items = [
    { key: "1", icon: <BarChartOutlined />, label: "Dashboard", onClick: () => navigate("/dashboard")  },
    { key: "2", icon: <SafetyOutlined />, label: "User Roles & Permissions" },
    { key: "3", icon: <UsergroupAddOutlined />, label: "Customer Management",  onClick: () => navigate("/customer-list")  },
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
        collapsible
        collapsed={collapsed}
        onCollapse={value => setCollapsed(value)}
        style={{
          position: "fixed",
          left: 0,
          bottom: 0,
          top: 0,
          backgroundColor: "#1E4C8F",
          zIndex: 200,
          paddingTop: "5px",
         

        }}
        width = {327}
        
      >
 
      {!collapsed && (
        <div
          style={{
            color: "white",
            fontSize: "30px",
            paddingLeft: "20px",
            paddingBottom: "10px",
          }}
        >
          MENU
        </div>
      )}

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
