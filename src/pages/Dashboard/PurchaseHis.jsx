import React, { useEffect, useState } from "react";
import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import { exportPurchase, getPurchase } from "@/services/customerService";
import { useSelector } from "react-redux";
import { Table, Button, Modal } from "antd";
import constants from "@/constants/index";
import { downloadFile } from "@/utils/exportUtils";
import { showExportModal } from "@/utils/modalUtils";
import { formatDate } from "@/utils/formatDate";
import { formatMoney } from "@/utils/formatMoney";
import { formatCenter } from "@/utils/formatCenter";

const PurchaseHis = () => {
  const [purchase, setPurchase] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const id = useSelector((state) => state.user.id);

  useEffect(() => {
    const fetchPurchase = async () => {
      const response = await getPurchase({ page: 0, customerId: id });
      const newResult = response.data.content;

      const result = newResult.map((item) => ({
        ...item,
        key: item.id,
        carModel: item.car?.model || "",
        vehicleIdentificationNumber: item.vehicleIdentificationNumber,
        price: formatMoney(item.car?.price),
        serviceCenter: formatCenter(item.serviceCenter),
        paymentMethod: item.payment?.paymentMethod,
        purchaseDate: formatDate(item.purchaseDate),
        expiredDate: formatDate(item.warranty.expiredDate),
        startedDate: formatDate(item.warranty.startedDate),
      }));
      console.log("a",result);

      setPurchase(result);
    };

    fetchPurchase();
  }, [id]);

  const viewDetails = (id) => {
    const purchaseItem = purchase.find((item) => item.key === id);
    setSelectedPurchase(purchaseItem);
    setIsModalVisible(true);
  };

  const exportHandle = async () => {
    try {
      const response = await exportPurchase(id);
      const password = downloadFile(response.data);
      showExportModal(password);
    } catch (error) {
      console.error("Error exporting file:", error);
    }
  };

  const columns = [
    ...constants.PURCHASE_LIST,
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined style={{ fontSize: "20px", color: "#BFBFBF" }} />}
          onClick={() => viewDetails(record.key)}
        />
      ),
    },
  ];
  console.log("customer", selectedPurchase);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
        style={{ marginTop: "16px" }}
      />

      <Modal
        title={
          <div style={{ textAlign: "center", fontWeight: "bold" }}>
            Purchase Details
          </div>
        }
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedPurchase && (
          <div style={{ paddingLeft: "12px", paddingRight: "12px" }}>
            <div style={{ fontWeight: "bold", marginBottom: "12px" }}>
              Basic Details
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span style={{ color: "#8C8C8C" }}>Customer</span>
              <span>{selectedPurchase.customer?.fullName}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span style={{ color: "#8C8C8C" }}>Sales Representative</span>
              <span>{selectedPurchase.salesRepresentative}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span style={{ color: "#8C8C8C" }}>Center</span>
              <span>{selectedPurchase.serviceCenter}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span style={{ color: "#8C8C8C" }}>Invoice Number</span>
              <span>{selectedPurchase.payment?.invoice}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span style={{ color: "#8C8C8C" }}>Warranty Start Date</span>
              <span>{selectedPurchase?.startedDate}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span style={{ color: "#8C8C8C" }}>Warranty Expiry Date</span>
              <span>{selectedPurchase?.expiredDate}</span>
            </div>

            <div
              style={{ fontWeight: "bold", marginTop: 24, marginBottom: 12 }}
            >
              Installment Details
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span style={{ color: "#8C8C8C" }}>Total Purchase Price</span>
              <span>{selectedPurchase.payment?.price}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span style={{ color: "#8C8C8C" }}>Initial Payment</span>
              <span>{selectedPurchase.payment?.initialPayment}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span style={{ color: "#8C8C8C" }}>Installment Amount</span>
              <span>{selectedPurchase.payment?.installmentAmount}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PurchaseHis;
