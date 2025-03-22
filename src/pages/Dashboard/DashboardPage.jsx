import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import "../../assets/styles/dashboard.css";
import { getUserProfile } from "../../services/userService";
import {
  Layout,
  Menu,
  Row,
  Col,
  Avatar,
  Button,
  Dropdown,
  Modal,
  theme,
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
  CaretDownFilled,
  UserOutlined,
  LockOutlined,
  LogoutOutlined,
  SafetyOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;
const { confirm } = Modal;

const DashboardPage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile(); 
        setUserProfile(response.data); 
        console.log("User profile:", response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error.response?.data || error.message);
      }
    };

    fetchUserProfile(); // Gọi hàm khi component được render
  }, []);
  const showConfirm = () => {
    confirm({
      title: "Are you sure you want to logout?",
      icon: <ExclamationCircleFilled />,
      okText: "Confirm",
      cancelText: "Cancel",
      onOk() {
        localStorage.removeItem("authToken");
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
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
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

      <Layout>
        <Header className="header-layout">
        <Row align="middle" justify="space-between" gutter={[12, 12]}>
            <Col>
            <div style={{
                color: "#1E4C8F",
                fontFamily: "'Russo One', sans-serif",
                fontSize: 35,

              }}>RISTASKERX</div>

            </Col>
            <Col style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Avatar size="default" icon={<UserOutlined />} />
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
                <span style={{ fontWeight: "bold" }}>{userProfile?.results?.email || "Loading..."}</span>
                <span style={{ fontSize: "12px", color: "gray", paddingTop: "5px" }}>Admin</span>
              </div>
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
          <Content>
            <div
              className="site-layout-background"
              style={{
                padding: 24,
                minHeight: 360,
              }}
            >
              Content
            </div>
          </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
         
        </Footer>
      </Layout>
    </Layout>
  );
};
export default DashboardPage;
