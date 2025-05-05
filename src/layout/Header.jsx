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
            <div className="text-[25px] font-russo text-[#6055F2]">
              RISTASKERX
            </div>
          </Col>
          <Col className="flex items-center gap-[12px]">
            <Avatar size="default" icon={<UserOutlined />} />
            <div className="flex flex-col leading-[1] ">
              <span className="font-bold">
                {userProfile?.results?.email || "Loading..."}
              </span>
              <span className="text-[12px] text-gray-500 pt-[5px]">Admin</span>
            </div>
            <div>
              <Dropdown
                menu={{ items: itemsUser }}
                trigger={["click"]}
                arrow
                overlayStyle={{ minWidth: 160 }}
              >
                <Button
                  icon={<CaretDownFilled />}
                  className="outline-none bg-transparent border-none"
                />
              </Dropdown>
            </div>
          </Col>
        </Row>
      </Header>
    </>
  );
};

export default HeaderCommon;
