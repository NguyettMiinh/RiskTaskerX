import React, { useEffect, useState } from "react";
import {
  DownloadOutlined,
  EyeOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Table, Button, Modal, Row, Col, Pagination } from "antd";
import { useSelector } from "react-redux";

import {
  getPurchase,
  exportPurchase,
  getPayment,
} from "@/services/customerService";

import constants from "@/constants/index";
import { downloadFile } from "@/utils/exportUtils";
import { showExportModal } from "@/utils/modalUtils";
import { formatDate } from "@/utils/formatDate";
import { formatMoney } from "@/utils/formatMoney";
import { formatCenter } from "@/utils/formatCenter";

const DetailRow = ({ label, value }) => (
  <Row justify="space-between" style={{ marginBottom: 16 }}>
    <Col style={{ color: "#8C8C8C" }}>
      {label}
    </Col>
    <Col>{value}</Col>
  </Row>
);


const Purchase = () => {
  const id = useSelector((state) => state.user.id);
  const [purchase, setPurchase] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [paymentDetail, setPaymentDetail] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPurchase, setTotalPurchase] = useState(0);

  // Gọi API lấy danh sách mua hàng
  const fetchPurchase = async (page) => {
    try {
      const response = await getPurchase({ page: page, customerId: id });
      const rawData = response.data.content || [];
      const formatted = rawData.map((item) => ({
        ...item,
        key: item.id,
        carModel: item.car?.model || "",
        vehicleIdentificationNumber: item.vehicleIdentificationNumber,
        price: formatMoney(item.car?.price),
        serviceCenter: formatCenter(item.serviceCenter),
        paymentOption: item.payment?.paymentOption.replace(/_/g, " "),
        paymentMethods: item.payment?.paymentMethod.replace(/_/g, " "),
        paymentId: item.payment?.id,
        purchaseDate: formatDate(item.purchaseDate),
        expiredDate: formatDate(item.warranty?.expiredDate),
        startedDate: formatDate(item.warranty?.startedDate),
      }));
      setPurchase(formatted);
      setTotalPurchase(response.data.totalElements);
    } catch (error) {
      console.error("Failed to fetch purchase history:", error);
    }
  };

  useEffect(() => {
    fetchPurchase(currentPage);
  }, [id, currentPage,pageSize]);

  const columnsDetail = [
    {
      title: "No",
      dataIndex: "id",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
    },
    {
      title: "Amount",
      dataIndex: "monthlyPayment",
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethods",
    },
    {
      title: "Payment Date",
      dataIndex: "paymentDate",
    },
    {
      title: "Invoice",
      dataIndex: "invoice",
      render: (_, record) => (
        <Button
          type="link"
          icon={
            <>
              <FileTextOutlined style={{ fontSize: 16, color: "#6055F2" }} />
              <span
                style={{
                  fontSize: 12,
                  color: "black",
                  textDecoration: "underline",
                }}
              >
                Download
              </span>
            </>
          }
        />
      ),
    },
  ];
  const viewDetails = async (id) => {
    const purchaseItem = purchase.find((item) => item.key === id);
    const paymentId = purchaseItem?.paymentId;
    try {
      const res = await getPayment(paymentId);
      const formattedData = res.data.map((item) => ({
        ...item,
        dueDate: formatDate(item.dueDate),
        paymentDate: formatDate(item.paymentDate),
        monthlyPayment: formatMoney(item.monthlyPayment),
        paymentMethod: item.payment?.paymentMethod.replace(/_/g, " "),
        paymentOption: item.payment?.paymentOption.replace(/_/g, " "),
      }));
      setPaymentDetail(formattedData);
    } catch (err) {
      console.error("Error fetching payment detail:", err);
    }

    setSelectedPurchase(purchaseItem);
    setIsModalVisible(true);
  };

  const exportHandle = async () => {
    try {
      const response = await exportPurchase(id);
      const password = downloadFile(response.data);
      showExportModal(password,"Purchase History");
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
          icon={<EyeOutlined style={{ fontSize: 20, color: "#BFBFBF" }} />}
          onClick={() => viewDetails(record.key)}
        />
      ),
    },
  ];

  /// de xuat dung Col Va Row trong antd
  return (
    <div>
      {/* Export button */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          icon={<DownloadOutlined style={{ color: "#6055F2" }} />}
          style={{ height: 40, borderColor: "#C9C6ED" }}
          onClick={exportHandle}
        >
          <span style={{ color: "#6055F2" }}>Export</span>
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={purchase}
        className="custom-table"
        style={{ marginTop: 16 }}
        pagination={false}
      />
       <Pagination
        current={currentPage}
        total={totalPurchase}
        pageSize={pageSize}
        showSizeChanger
        pageSizeOptions={["5", "10", "20", "50"]}
        onChange={(page, newPageSize) => {
          setPageSize(newPageSize);
          setCurrentPage(page);
        }}
        showTotal={(total) => `Total ${total} items`}
        className="flex justify-end mt-2.5"
      />
      {/* Detail Modal */}
      <Modal
        title={
          <div style={{ textAlign: "center", fontWeight: "bold" , fontSize: "24px"}}>
            Purchase Details
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedPurchase && (
          <div style={{ padding: "0 12px" }}>
            {selectedPurchase.paymentOption === "Installment" && (
              <Row>Basic Details</Row>
            )}
              <DetailRow label="Customer" value= {selectedPurchase.customer?.fullName}/>
            <DetailRow
              label="Sales Representative"
              value={selectedPurchase.admin?.fullName}
            />
            <DetailRow label="Center" value={selectedPurchase.serviceCenter} />
            <DetailRow
              label="Invoice Number"
              value={
                paymentDetail?.invoice || selectedPurchase.payment?.invoice
              }
            />
              <DetailRow
                label="Invoice"
                value={
                  <>
                    <FileTextOutlined
                      style={{ fontSize: 16, color: "#6055F2" }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        color: "black",
                        textDecoration: "underline",
                      }}
                    >
                      Download the invoice
                    </span>
                  </>
                }
              />

            <DetailRow
              label="Warranty Start Date"
              value={selectedPurchase.startedDate}
            />
            <DetailRow
              label="Warranty Expiry Date"
              value={selectedPurchase.expiredDate}
            />
            {selectedPurchase.paymentOption === "Full payment" && (
              <div>
                <DetailRow
                  label="Total Purchase Price"
                  value={selectedPurchase.price}
                />

                <DetailRow
                  label="Payment method"
                  value={
                    (paymentDetail?.payment?.paymentMethod ||
                    selectedPurchase.payment?.paymentMethod).replace(/_/g, " ")
                  }
                />
              </div>
            )}

            {/* Installment details */}
            {selectedPurchase.paymentOption === "Installment" && (
              <>
                <div
                  style={{
                    fontWeight: "bold",
                    marginTop: 24,
                    marginBottom: 12,
                  }}
                >
                  Installment Details
                </div>

                <DetailRow
                  label="Total Purchase Price"
                  value={`${formatMoney(paymentDetail[0]?.payment?.price)}`}
                />
                <DetailRow
                  label="Initial Payment"
                  value={`${formatMoney(
                    paymentDetail[0]?.payment.initialPayment
                  )}`}
                />
                <DetailRow
                  label="Installment Amount"
                  value={`${formatMoney(paymentDetail[0]?.installmentAmount)} `}
                />
                <DetailRow
                  label="Installment Plan"
                  value={`${paymentDetail[0]?.installmentPlan} months`}
                />
                <DetailRow
                  label="Remaining Installment Months"
                  value={`${paymentDetail[0]?.remainingInstallmentMonths} months`}
                />
                <Table
                  columns={columnsDetail}
                  dataSource={paymentDetail}
                  pagination={false}
                />
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Purchase;
