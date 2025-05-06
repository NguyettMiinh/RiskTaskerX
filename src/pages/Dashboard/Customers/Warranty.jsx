import React, { useEffect, useState } from "react";
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
  Pagination,
} from "antd";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import constants from "@/constants/index";
import { downloadFile } from "@/utils/exportUtils";
import { showExportModal } from "@/utils/modalUtils";
import { formatDate } from "@/utils/formatDate";
import { formatMoney } from "@/utils/formatMoney";
import { formatCenter } from "@/utils/formatCenter";
import { toast } from "react-toastify";
import moment from "moment";
import { useForm, Controller, set } from "react-hook-form";
import {  useMutation } from "@tanstack/react-query";

const Warranty = () => {
  const [warranty, setWarranty] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalWarranty, setTotalWarranty] = useState(0);
  const id = useSelector((state) => state.user.id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const dataSource = warranty.map((item) => ({ ...item, key: item.id }));

  const fetchWarranty = async (page) => {
    const response = await getWarranty({ page: page, customerId: id });
    const newResult = response.data.content;
    const result = newResult.map((item) => ({
      ...item,
      serviceCenter: formatCenter(item.serviceCenter),
      serviceDate: formatDate(item.serviceDate),
      serviceCost: formatMoney(item.serviceCost),
    }));
    setWarranty(result);
    setTotalWarranty(response.data.totalElements);
  };

  useEffect(() => {
    fetchWarranty(currentPage);
  }, [id, currentPage, pageSize]);


  const exportHandle = async () => {
    try {
      const response = await exportWarranty(id);
      const password = downloadFile(response.data);
      showExportModal(password, "Warranty History");
    } catch (error) {
      console.error("Error exporting file:", error);
    }
  };

  const convertToISO = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString();
  };

  const onSubmit = async (formData) => {
    const payload = {
      customerId: id,
      carModel: formData.model,
      licensePlate: formData.license,
      serviceType: formData.type,
      serviceCenter: formData.center,
      serviceDate: convertToISO(formData.date),
      serviceCost: formData.cost,
    };
    try {
      await addWarrantyData(payload);

      setWarranty((prev) => [
        ...prev,
        {
          ...payload,
          serviceCenter: formatCenter(payload.serviceCenter),
          serviceDate: formatDate(payload.serviceDate),
          serviceCost: formatMoney(payload.serviceCost),
        },
      ]);
      
      toast.success("New information added successfully!");
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error("Error adding warranty data:", error);
    }
  }

    return (
      <div>
        <div className="flex justify-end mb-2.5">
          <Button
            icon={<PlusOutlined style={{ color: "#6055F2" }} />}
            style={{ height: 40, borderColor: "#C9C6ED", marginRight: 5 }}
            onClick={() => setIsModalOpen(true)}
          >
            <span style={{ color: "#6055F2" }}> Add Warranty Information </span>
          </Button>
          <Button
            icon={<DownloadOutlined style={{ color: "#6055F2" }} />}
            style={{ height: 40, borderColor: "#C9C6ED" }}
            onClick={exportHandle}
          >
            <span style={{ color: "#6055F2" }}>Export</span>
          </Button>
        </div>

        <Table
          columns={constants.WARRANTY_LIST}
          dataSource={dataSource}
          className="custom-table"
          pagination={false}
        />
        <Pagination
          current={currentPage}
          total={totalWarranty}
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
        <Modal
          title={
            <div
              style={{
                textAlign: "center",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              Add Warranty Information
            </div>
          }
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Typography.Text strong>
                Car model <Typography.Text type="danger">*</Typography.Text>
              </Typography.Text>
              <Controller
                name="model"
                control={control}
                rules={{ required: "Car model is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    style={{ width: "100%" }}
                    options={constants.MODEL_OPTIONS}
                    placeholder="Choose the car model"
                  />
                )}
              />
              {errors.model && (
                <p style={{ color: "red" }}>{errors.model.message}</p>
              )}
            </div>

            <div>
              <Typography.Text strong>
                License Plate <Typography.Text type="danger">*</Typography.Text>
              </Typography.Text>
              <Controller
                name="license"
                control={control}
                rules={{
                  required: "License plate is required",
                  pattern: {
                    value: /^.{9}$/,
                    message: "License plate must be up to 9 digits",
                  },
                }}
                render={({ field }) => (
                  <Input {...field} placeholder="Enter the license plate" />
                )}
              />
              {errors.license && (
                <p style={{ color: "red" }}>{errors.license.message}</p>
              )}
            </div>

            <div>
              <Typography.Text strong>
                Service Type <Typography.Text type="danger">*</Typography.Text>
              </Typography.Text>
              <Controller
                name="type"
                control={control}
                rules={{ required: "Service type is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    style={{ width: "100%" }}
                    options={constants.TYPE_OPTIONS}
                    placeholder="Choose the service type"
                  />
                )}
              />
              {errors.type && (
                <p style={{ color: "red" }}>{errors.type.message}</p>
              )}
            </div>

            <div>
              <Typography.Text strong>
                Service Center{" "}
                <Typography.Text type="danger">*</Typography.Text>
              </Typography.Text>
              <Controller
                name="center"
                control={control}
                rules={{ required: "Service center is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    style={{ width: "100%" }}
                    options={constants.CENTER_OPTIONS}
                    placeholder="Choose the service center"
                  />
                )}
              />
              {errors.center && (
                <p style={{ color: "red" }}>{errors.center.message}</p>
              )}
            </div>

            <div>
              <Typography.Text strong>
                Service Date <Typography.Text type="danger">*</Typography.Text>
              </Typography.Text>
              <Controller
                name="date"
                control={control}
                rules={{ required: "Service date is required" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    disabledDate={(current) =>
                      current && current.isAfter(moment(), "day")
                    }
                    placeholder="Select the service date"
                  />
                )}
              />
              {errors.date && (
                <p style={{ color: "red" }}>{errors.date.message}</p>
              )}
            </div>

            <div>
              <Typography.Text strong>
                Service Cost <Typography.Text type="danger">*</Typography.Text>
              </Typography.Text>
              <Controller
                name="cost"
                control={control}
                rules={{
                  required: "Service cost is required",
                  pattern: {
                    value: /^[0-9]+(\.[0-9]{1,2})?$/,
                    message: "Invalid cost format. Example: 1000 or 99.99",
                  },
                }}
                render={({ field }) => (
                  <Input {...field} placeholder="Enter the service cost" />
                )}
              />
              {errors.cost && (
                <p style={{ color: "red" }}>{errors.cost.message}</p>
              )}
            </div>

            <div style={{ marginTop: 16, textAlign: "right" }}>
              <Button
                onClick={() => setIsModalOpen(false)}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" disabled={!isValid}>
                Add New Warranty
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    );
  };


export default Warranty;
