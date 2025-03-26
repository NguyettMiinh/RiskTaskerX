import React, { useState } from "react";
import { Table, Pagination, Input, Button } from "antd";
import {
  SearchOutlined,
  DownOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { Tag } from "antd";
import { exportApi } from "@/services/customerService";

const columns = [
  { title: "Customer ID", dataIndex: "name" },
  { title: "Customer Name", dataIndex: "age" },
  { title: "Phone number", dataIndex: "address" },
  { title: "Address", dataIndex: "name" },
  { title: "Email", dataIndex: "age" },
  {
    title: "Tier",
    dataIndex: "tier",
    render: (tier) => {
      let color = "default";
      if (tier === "Bronze") color = "orange";
      if (tier === "Silver") color = "gray";
      if (tier === "Gold") color = "gold";
      if (tier === "Diamond") color = "blue";

      return <Tag color={color}>{tier}</Tag>;
    },
  },
  { title: "Actions", dataIndex: "address" },
];

const tiers = ["Bronze", "Silver", "Gold", "Diamond"];

const allData = Array.from({ length: 50 }).map((_, i) => ({
  key: i,
  name: `Edward King ${i + 1}`,
  age: 30 + i,
  address: `London, Park Lane no. ${i + 1}`,
  tier: tiers[Math.floor(Math.random() * tiers.length)], // Chọn tier ngẫu nhiên
}));

const pageSize = 5;

const CustomerList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const paginatedData = allData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const onSubmit = async () => {
    try {
      const response = await exportApi();
      
      const contentDisposition = response.headers["content-disposition"];
      console.log("Content-Disposition:", contentDisposition); 

      let fileName = "downloaded_file"; header

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) {
          fileName = match[1].trim(); 
        }
      }
  
      // Tạo URL và tải file
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // Giữ tên file từ API
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting file:", error);
    }
  };
  

  
  
  

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        minHeight: "100vh",
        padding: "10px",
      }}
    >
      <div
        style={{
          width: "100%",
          background: "#fff",
          padding: "50px",
          borderRadius: "8px",
          boxShadow:
            "-2px 4px 6px rgba(0, 0, 0, 0.15), 2px 4px 6px rgba(0, 0, 0, 0.15), 0px 6px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <div style={{fontSize: "21px", paddingBottom: "8px"}}>
            Home /{" "}
            <span>
              <a href="#" style={{ textDecoration: "underline" }} >Customer Management</a>
            </span>
          </div>
          <div style={{fontSize: 30, fontWeight: "bold"}}>Customer List</div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", justifyContent:"space-around" }}>
          <div iv
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%", 
            }}>
            <Input
              placeholder="Search customer by Name, Customer ID"
              style={{
                width: "400px",
                height: "40px",
                borderRadius: "6px 0 0 6px",
                border: "1px solid #ccc",
              }}
            />
            <Button
              type="primary"
              style={{
                height: "40px",
                width: "56px",
                backgroundColor: "#6055F2",
                color: "#fff",
                borderRadius: "0 6px 6px 0",
                border: "none",
                marginLeft: "-10px",
              }}
            >
              <SearchOutlined style={{ fontSize: "24px", color: "#fff" }} />
            </Button>
            <Button style={{ height: "40px", borderColor: "#C9C6ED", marginLeft: "23px" }}>
              <span style={{color: "#6055F2"}}>All Filter </span>
              <DownOutlined style={{ marginLeft: "5px", color: "#6055F2" }} />
            </Button>
            <Button style={{ height: "40px", borderColor: "#C9C6ED"}}>
              <span style={{color: "#6055F2"}}>All Status </span>
              <DownOutlined style={{ marginLeft: "5px", color: "#6055F2" }} />
            </Button>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%", // Đảm bảo chiều rộng bằng với bảng
            }}
          >
            <Button
              icon={<DownloadOutlined style={{ color: "#6055F2" }} />}
              style={{
                height: "40px",
                borderColor: "#C9C6ED",
              }}
              onClick = {onSubmit}
            >
              <span style={{ color: "#6055F2" }}>Export Customer List</span>
            </Button>
          </div>
          
        </div>

        <Table
          columns={columns}
          dataSource={paginatedData}
          pagination={false}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "10px",
          }}
        >
          <Pagination
            current={currentPage}
            total={allData.length}
            pageSize={pageSize}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
