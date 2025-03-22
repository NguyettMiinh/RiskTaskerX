import HeaderCommon from "./HeaderCommon";
import Sidebar from "./Sidebar";
import { Layout} from "antd";
const {Content} = Layout;
const DefaultLayout = ({ children }) => {
  return (
    <Layout style={{
      minHeight: '100vh',
    }}>
      <Sidebar />
      <Layout>
        <HeaderCommon />
        <Content>
          {children}
        </Content>
      </Layout>   
    </Layout>
  );
}

export default DefaultLayout;