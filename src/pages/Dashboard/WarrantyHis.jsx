import React, { useEffect, useState } from 'react'
import {exportWarranty, getWarranty } from '@/services/customerService';
import { useSelector } from 'react-redux';
import { Button, Table, Input, Modal, Select} from 'antd';
import { DownloadOutlined, CopyOutlined} from '@ant-design/icons';


const Warranty = () => {
  const [warranty, setWarranty] = useState();
  const id = useSelector((state) => state.user.id);

  useEffect(() => {
      const fetchWarranty = async () => {
        const result = await getWarranty(id);
        setWarranty(result.data);
      }
      fetchWarranty();
  },[])
  /// columns data
  const columns = [
    { title: "Car model", dataIndex: "carModel" },
    { title: "License Plate", dataIndex: "licensePlate" },
    { title: "Service Type", dataIndex: "serviceType" },
    { title: "Service Center", dataIndex: "serviceCenter" },
    { title: "Service Date", dataIndex: "serviceDate" },
    { title: "Service Cost", dataIndex: "serviceCost" },
    
  ];
  const exportHandle = async () => {
    console.log("Selected values:",id);
    try {
      const response = await exportWarranty(id);

      console.log(response.data.fullName);

      const fileName = response.data.fileName;
      const password = response.data.password;
      console.log(fileName, password);

      const byteCharacters = atob(response.data.response);
      const byteNumbers = new Uint8Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const blob = new Blob([byteNumbers], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      setTimeout(() => {
        Modal.info({
          title: "Export Customer List",
          content: (
            <div>
              <div
                style={{
                  fontSize: "15px",
                  paddingBottom: "10px",
                }}
              >
                Export password
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <Input
                  value={password}
                  readOnly
                  style={{
                    width: "300px",
                    borderRadius: "6px 0 0 6px",
                    border: "1px solid #ccc",
                    height: "40px",
                    fontWeight: 400,
                  }}
                />
                <Button
                  icon={
                    <CopyOutlined
                      style={{
                        color: "white",
                      }}
                    />
                  }
                  onClick={() => {
                    navigator.clipboard.writeText(password);
                  }}
                  style={{
                    backgroundColor: "#6055F2",
                    outline: "none",
                    marginLeft: "-10px",
                    borderRadius: "0 6px 6px 0",
                    border: "1px solid #ccc",
                    height: "40px",
                    width: "50px",
                  }}
                ></Button>
              </div>
            </div>
          ),
          okText: "Confirm",
          okButtonProps: {
            style: {
              backgroundColor: "#6055F2",
              borderColor: "#6055F2",
              color: "white",
            },
          },
          icon: null,
          onOk() {},
        });
      }, 1000);
    } catch (error) {
      console.error("Error exporting file:", error);
    }
  };

  const addHandle = () => {
    Modal.confirm({
      title: 'Add Warranty Information',
      icon: null,
      content:( <>
        <Input placeholder= "Enter the car model" />
        <Input placeholder= "Enter the license plate" />
        <Select placeholder= "Choose the service type" />
        <Input placeholder= "Enter the license plate" />
        <Input placeholder= "Enter the service cost" />
        
      </>),
      okText: 'Add New Warranty',
      cancelText: 'Cancel',
    });
  }
  return (
    <div>
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
        }}>
          <Button
              icon={<DownloadOutlined style={{ color: "#6055F2" }} />}
              style={{ height: "40px", borderColor: "#C9C6ED", marginRight: "5px" }}
              onClick={() => addHandle(id)}
            >
              <span style={{ color: "#6055F2" }}> Add Warranty Information</span>
            </Button>
          <Button
              icon={<DownloadOutlined style={{ color: "#6055F2" }} />}
              style={{ height: "40px", borderColor: "#C9C6ED" }}
              onClick={() => exportHandle(id)}
            >
              <span style={{ color: "#6055F2" }}>Export</span>
            </Button>
        </div>
       <Table
          columns={columns}
          dataSource={warranty}
          className="custom-table"
        />
    </div>
  )
}

export default Warranty;
