import React, { useEffect, useState, useRef } from "react";
import {
  exportWarranty,
  getWarranty,
  addWarrantyData,
} from "@/services/customerService";
import { useSelector } from "react-redux";
import {
  Button,
  Table,
  Input,
  Modal,
  Select,
  Typography,
  DatePicker,
} from "antd";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import constants from "@/constants/index";
import { downloadFile } from "@/utils/exportUtils";
import { showExportModal } from "@/utils/modalUtils";
import { formatDate } from "@/utils/formatDate";
import { formatMoney } from "@/utils/formatMoney";
import { formatCenter } from "@/utils/formatCenter";
import { toast } from "react-toastify";

const Warranty = () => {
  const [warranty, setWarranty] = useState();
  const warrantyData = useRef({
    model: "",
    license: "",
    type: "",
    center: "",
    date: "",
    cost: "",
  });

  const id = useSelector((state) => state.user.id);
  const dataSource = warranty?.map((item) => ({ ...item, key: item.id }));

  const fetchWarranty = async () => {
    const response = await getWarranty({page: 0, customerId:  id});
    const newResult = response.data.content;
    const result = newResult.map((item) => ({
      ...item,
      serviceCenter: formatCenter(item.serviceCenter),
      serviceDate: formatDate(item.serviceDate),
      serviceCost: formatMoney(item.serviceCost),
    }));
    setWarranty(result);
  };
  useEffect(() => {
    fetchWarranty();
  }, [id]);

  /// columns data
  const columns = constants.WARRANTY_LIST;
  const exportHandle = async () => {
    try {
      const response = await exportWarranty(id);
      const password = downloadFile(response.data);
      showExportModal(password);
    } catch (error) {
      console.error("Error exporting file:", error);
    }
  };

  const handleInputChange = (field, value) => {
    warrantyData.current[field] = value;
  };
  // format datedate
  function convertToISO(dateString) {
    const date = new Date(dateString);
    return date.toISOString();
  }
  const handleAddWarranty = async () => {
    const payload = {
      customerId: id,
      carModel: warrantyData.current.model,
      licensePlate: warrantyData.current.license,
      serviceType: warrantyData.current.type,
      serviceCenter: warrantyData.current.center,
      serviceDate: warrantyData.current.date,
      serviceCost: warrantyData.current.cost,
    };

    try {
      await addWarrantyData(payload);
      setWarranty((prev) => [
        ...prev,
        {
          ...payload,
          serviceCenter: formatCenter(warrantyData.current.center),
          serviceDate: formatDate(warrantyData.current.date),
          serviceCost: formatMoney(warrantyData.current.cost),
        },
      ]);
      toast.success("New information added successfully!");
      Modal.destroyAll();
    } catch (error) {
      console.error("Error adding warranty:", error);
    }
  };
  

  const addHandle = () => {
    Modal.confirm({
      title: (
        <div style={{ textAlign: "center", fontSize: "22px" }}>
          Add Warranty Information
        </div>
      ),
      icon: null,
      content: (
        <>
          <div>
            <Typography.Text strong>
              Car model <Typography.Text type="danger">*</Typography.Text>
            </Typography.Text>
            <Select
              placeholder="Choose the car model"
              style={{ width: "100%" }}
              options={constants.MODEL_OPTIONS}
              onChange={(value) => handleInputChange("model", value)}
            />
          </div>

          <div>
            <Typography.Text strong>
              License Plate <Typography.Text type="danger">*</Typography.Text>
            </Typography.Text>
            <Input
              placeholder="Enter the license plate"
              onChange={(e) => handleInputChange("license", e.target.value)}
            />
          </div>

          <div>
            <Typography.Text strong>
              Service Type <Typography.Text type="danger">*</Typography.Text>
            </Typography.Text>
            <Select
              placeholder="Choose the service type"
              style={{ width: "100%" }}
              options={constants.TYPE_OPTIONS}
              onChange={(value) => handleInputChange("type", value)}
            />
          </div>

          <div>
            <Typography.Text strong>
              Service Center <Typography.Text type="danger">*</Typography.Text>
            </Typography.Text>
            <Select
              placeholder="Choose the service center"
              style={{ width: "100%" }}
              options={constants.CENTER_OPTIONS}
              onChange={(value) => handleInputChange("center", value)}
            />
          </div>

          <div>
            <Typography.Text strong>
              Service Date <Typography.Text type="danger">*</Typography.Text>
            </Typography.Text>
            <DatePicker
              placeholder="Select date"
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              onChange={(dateString) =>
                handleInputChange("date", convertToISO(dateString))
              }
            />
          </div>

          <div>
            <Typography.Text strong>
              Service Cost <Typography.Text type="danger">*</Typography.Text>
            </Typography.Text>
            <Input
              placeholder="Enter the service cost"
              onChange={(e) => handleInputChange("cost", e.target.value)}
            />
          </div>
        </>
      ),
      okText: "Add New Warranty",
      cancelText: "Cancel",
      onOk: handleAddWarranty,
    });
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
        }}
      >
        <Button
          icon={<PlusOutlined style={{ color: "#6055F2" }} />}
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
      <Table columns={columns} dataSource={dataSource} className="custom-table" />
    </div>
  );
};

export default Warranty;
