import React from 'react';
import PersonalInfor from './PersonalInfor';
import { Tabs } from 'antd';
import "@assets/styles/customTabs.css";
import PurchaseHis from './purchaseHis';
import Warranty from './WarrantyHis';
const DetailCustomer = () => {
  const items = [
    {
      key: '1',
      label: 'Purchase history',
      children: <PurchaseHis />,
    },
    {
      key: '2',
      label: 'Warranty history',
      children: <Warranty />,
    }
  ];
  const onChange = key => {
    console.log(key);
  };
  return (
    <div style={{
      width: "100%",
      background: "#fff",
      paddingTop: "20px",
      paddingBottom: "20px",
      borderRadius: "8px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
      marginLeft: "20px",
    }}>
      <div style={{ paddingLeft: "10px" ,marginBottom: "20px" }}>
          <div>
            Home /{" "}
            <span>
                Customer Management / {" "}
            </span>
            <span>
            <a href="#" style={{ textDecoration: "underline" }}>
                Customer Details
              </a>
            </span>
          </div>
          
        </div>
        <div style={{
          display: "flex"
        }}>
          <PersonalInfor />
          <div style={{
            paddingLeft: "50px"
          }} >
          <Tabs
            defaultActiveKey="1"
            items={items}
            onChange={onChange}
            
          />
          </div>
        </div>
     
    </div>
  )
}

export default DetailCustomer
