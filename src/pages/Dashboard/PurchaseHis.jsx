import React, { useEffect, useState } from 'react'
import { DownloadOutlined, EyeOutlined, CopyOutlined } from '@ant-design/icons';
import { exportPurchase, getPurchase } from '@/services/customerService';
import { useSelector } from 'react-redux';
import { Table , Button, Modal, Input} from 'antd';
const PurchaseHis = () => {
  const [purchase, setPurchase] = useState();
  const id = useSelector((state) => state.user.id);

  useEffect(() => {
      const fetchPurchase = async () => {
        const result = await getPurchase(id);
        setPurchase(result.data);
      }
      fetchPurchase();
  },[])
  /// columns data
  const columns = [
    { title: "Car model", dataIndex: "carModel" },
    { title: "VIN", dataIndex: "vehicleIdentificationNumber" },
    { title: "Price", dataIndex: "price" },
    { title: "Payment method", dataIndex: "paymentMethod" },
    { title: "Purchase date", dataIndex: "purchaseDate" },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <div>       
          <Button
            type="link"
            icon={
              <EyeOutlined style={{ fontSize: "20px", color: "#BFBFBF" }} />
            }
            onClick={() => viewDetails(record.id)}
          />
        </div>
      ),
    },
  ];
  const exportHandle = async () => {
    console.log("Selected values:",id);
    try {
      const response = await exportPurchase(id);

      console.log(response);

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
  return (
    <div>
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
        }}>
          <Button
              icon={<DownloadOutlined style={{ color: "#6055F2" }} />}
              style={{ height: "40px", borderColor: "#C9C6ED" }}
              onClick={() => exportHandle(id)}
            >
              <span style={{ color: "#6055F2" }}>Export Purchase History</span>
            </Button>
        </div>
          
       <Table
          columns={columns}
          dataSource={purchase}
          className="custom-table"
        />
    </div>
  )
}

export default PurchaseHis;
