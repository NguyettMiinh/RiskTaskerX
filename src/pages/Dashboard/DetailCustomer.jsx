import PersonalInfor from "./PersonalInfor";
import { Tabs } from "antd";
import "@assets/styles/customTabs.css";
import PurchaseHis from "./PurchaseHis";
import Warranty from "./WarrantyHis";
import { Link } from "react-router";
import Breadcrumbs from "@components/ui/Breadcrumbs";
const DetailCustomer = () => {
  
  const items = [
    {
      key: "1",
      label: "Purchase history",
      children: <PurchaseHis />,
    },
    {
      key: "2",
      label: "Warranty history",
      children: <Warranty />,
    },
  ];
  const onChange = (key) => {
    console.log(key);
  };
  return (
    <div  style={{
      display: "flex",
      minHeight: "100vh",
      padding: "10px",
    }}>
      <div style={{
          width: "100%",
          background: "#fff",
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingRight: "10px",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
        }}>
          <div style={{paddingLeft: "10px", marginBottom: "20px" }}>
           <Breadcrumbs />
          </div>

          <div
            style={{
              display: "flex",
            }}
          >
            <PersonalInfor />
            
            <div
              style={{
                paddingLeft: "20px",
              }}
            >
              <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
            </div>
          </div>

        </div>
    </div>
    
  );
};

export default DetailCustomer;
