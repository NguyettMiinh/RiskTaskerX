import { useState } from "react";
import HeaderCommon from "./HeaderCommon";
import Sidebar from "./Sidebar";
import { Layout} from "antd";
const {Content} = Layout;
const DefaultLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout style={{
      minHeight: '100vh'}}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}  />
      <Layout 
        style={{
          paddingTop: "70px",
          marginLeft: collapsed ? "80px" : "327px", 
          transition: "margin-left 0.3s ease",
        }}
      >
        <HeaderCommon collapsed={collapsed}/>
        <Content>
          {children}
        </Content>
      </Layout>   
    </Layout>
  );
}

export default DefaultLayout;