import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Layout, Menu, Row, Col, Avatar, Button, Dropdown, Modal } from "antd";
import {
  BarChartOutlined,
  UsergroupAddOutlined,
  CarOutlined,
  ToolOutlined,
  NotificationOutlined,
  ShoppingCartOutlined,
  ApartmentOutlined,
  MessageOutlined,
  CaretDownFilled,
  UserOutlined,
  LockOutlined,
  LogoutOutlined,
  SafetyOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import LogoW from "../assets/images/logoW.png"; // Ensure this path is correct

const { Header, Content, Sider } = Layout;
const { confirm } = Modal;

const DashboardPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const showConfirm = () => {
    confirm({
      title: "Are you sure you want to logout?",
      icon: <ExclamationCircleFilled />,
      okText: "Confirm",
      cancelText: "Cancel",
      onOk() {
        // localStorage.removeItem("token"); // Uncomment if needed
        navigate("/");
      },
    });
  };

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

  const itemsUser = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: <Link to="/">My Profile</Link>,
    },
    {
      key: "2",
      icon: <LockOutlined />,
      label: <Link to="/change-password">Change Password</Link>,
    },
    {
      key: "3",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: showConfirm,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
        backgroundImage: " linear-gradient(to right,#2563EB 0%, #7C3AED 77%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          background: "#fff",
          padding: "0 24px",
        }}
      >
        <Row align="middle" gutter={[12, 12]}>
          <Col>
            <Avatar size="default" icon={<UserOutlined />} />
          </Col>
          <Col
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              lineHeight: 1,
            }}
          >
            <span style={{ fontWeight: "bold" }}>Lian123@gmail.com</span>
            <span style={{ fontSize: "12px", color: "gray" }}>Admin</span>
          </Col>
          <Col>
            <Dropdown menu={{ items: itemsUser }} placement="bottom">
              <Button
                icon={<CaretDownFilled />}
                style={{
                    outline: "none",
                    background: "transparent",
                  border: "none",
                }}
              />
            </Dropdown>
          </Col>
        </Row>
      </Header>
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          width={294}
          collapsedWidth={100}
          style={{
            background: "#080066",
          }}
        >
          <div
            style={{
              height: 32,
              margin: 16,
              color: "white",
              textAlign: "center",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {!collapsed && (
              <img src={LogoW} alt="Dashboard Logo" style={{ height: 50 }} />
            )}
          </div>
          <Menu
            theme="dark"
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={items}
            style={{ background: "inherit", paddingTop: 10 }}
          />
        </Sider>
        <Layout
          style={{
            padding: "0 24px 24px",
          }}
        >
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            Content
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DashboardPage;
