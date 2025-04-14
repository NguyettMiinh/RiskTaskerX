import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { getUserProfile } from "@/services/userService";
import "@assets/styles/dashboard.css";
import { Layout, Row, Col, Avatar, Button, Dropdown, Modal } from "antd";
import {
  CaretDownFilled,
  UserOutlined,
  LockOutlined,
  LogoutOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import constants from "@/constants/storageKeys";
const { Header } = Layout;
const { confirm } = Modal;
const HeaderCommon = () => {
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  

  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile();
      setUserProfile(response.data);
    } catch (error) {
      console.error(
        "Error fetching user profile:",
        error.response?.data || error.message
      );
    }
  };
  useEffect(() => {
    fetchUserProfile();
  }, []);
  const showConfirm = () => {
    confirm({
      title: "Are you sure you want to logout?",
      icon: <ExclamationCircleFilled />,
      okText: "Confirm",
      cancelText: "Cancel",
      onOk() {
        localStorage.removeItem(constants.AUTH_TOKEN_KEY);
        navigate("/login");
      },
    });
  };
  const itemsUser = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: <Link to="/">My Profile</Link>,
    },
    {
      key: "2",
      icon: <LockOutlined />,
      label: <Link to="/layout/change-password">Change Password</Link>,
    },
    {
      key: "3",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: showConfirm,
    },
  ];
  return (
    <>
      <Header className="header-layout">
        <Row align="middle" justify="space-between" gutter={[12, 12]}>
          <Col>
            <div
              style={{
                color: "#6055F2",
                fontFamily: "'Russo One', sans-serif",
                fontSize: 30,
              }}
            >
              RISTASKERX
            </div>
          </Col>
          <Col style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Avatar size="default" icon={<UserOutlined />} />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                lineHeight: 1,
              }}
            >
              <span style={{ fontWeight: "bold" }}>
                {userProfile?.results?.email || "Loading..."}
              </span>
              <span
                style={{ fontSize: "12px", color: "gray", paddingTop: "5px" }}
              >
                Admin
              </span>
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
    </>
  );
};

export default HeaderCommon;
