import React, { useEffect, useState } from "react";
import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import { exportPurchase, getPurchase } from "@/services/customerService";
import { useSelector } from "react-redux";
import { Table, Button } from "antd";
import constants from "@/constants/index";
import { downloadFile } from "@/utils/exportUtils";
import { showExportModal } from "@/utils/modalUtils";
import { formatDate } from "@/utils/formatDate";
import { formatMoney } from "@/utils/formatMoney";

const PurchaseHis = () => {
  const [purchase, setPurchase] = useState();
  const id = useSelector((state) => state.user.id);

  useEffect(() => {
    const fetchPurchase = async () => {
      const response = await getPurchase(id);
      const newResult = response.data;
      console.log(newResult);
      const result = newResult.map((item) => ({
              ...item,
              purchaseDate: formatDate(item.purchaseDate),
              price: formatMoney(item.price),
            }));
      setPurchase(result);
    };
    fetchPurchase();
  }, []);

  /// columns data
  const columns = [
    ...constants.PURCHASE_LIST,
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
    try {
      const response = await exportPurchase(id);
      const password = downloadFile(response.data);
      showExportModal(password);
    } catch (error) {
      console.error("Error exporting file:", error);
    }
  };

  return (
    <div >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          icon={<DownloadOutlined style={{ color: "#6055F2" }} />}
          style={{ height: "40px", borderColor: "#C9C6ED" }}
          onClick={() => exportHandle(id)}
        >
          <span style={{ color: "#6055F2" }}>Export Purchase History</span>
        </Button>
      </div>
      <div>
        <Table columns={columns} dataSource={purchase} className="custom-table" />
      </div>
     
    </div>
  );
};

export default PurchaseHis;
