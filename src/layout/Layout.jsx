import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import HeaderCommon from "./Header";
import { useState } from "react";
const { Content } = Layout;
import { Layout } from "antd";

const LayoutDefault = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <Layout className="min-h-screen">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout
          className={`pt-[70px] transition-all duration-300 ease-in-out ${
            collapsed ? "ml-[80px]" : "ml-[295px]"
          }`}
        >
          <HeaderCommon collapsed={collapsed} />
          <Content>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default LayoutDefault;
