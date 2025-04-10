import { Outlet} from "react-router";
import Sidebar from "./Sidebar";
import HeaderCommon from "./Header";
import { useState } from "react";
const {Content} = Layout;
import { Layout } from "antd";
import Breadcrumbs from "@components/ui/Breadcrumbs";

const LayoutDefault = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <Layout style={{
        minHeight: '100vh'}}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}  />
        <Layout 
          style={{
            paddingTop: "70px",
            marginLeft: collapsed ? "80px" : "295px", 
            transition: "margin-left 0.3s ease",
          }}
        >
          <HeaderCommon collapsed={collapsed}/>
          <Content>
            <Outlet />
          </Content>
        </Layout>   
      </Layout>
 
    </>
  )
};

export default LayoutDefault;
