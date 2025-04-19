import { useState, useEffect } from "react";
import { Table, Pagination, Input, Button, Switch, Modal, Tag } from "antd";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setId } from "@/redux/userSlice";

import {
  exportApi,
  isActiveApi,
  segCustomer,
} from "@/services/customerService";
import constants from "@/constants/index";
import { downloadFile } from "@/utils/exportUtils";
import { showExportModal } from "@/utils/modalUtils";
import {
  SearchOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { showConfirmModal } from "@/utils/showConfimModal";
import SelectComponent from "@components/ui/SelectComponent";
import Breadcrumbs from "@components/ui/Breadcrumbs";
import "@assets/styles/list.css";
import "@assets/styles/filter.css";

const CustomerList = () => {
  const [customer, setCustomers] = useState([]);
  const [originalCustomers, setOriginalCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const [formData, setFormData] = useState({
    search: "",
    tiers: [],
    status: [],
    pageSize: 10,
    totalCustomers: 0,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { search, tiers, status, pageSize, totalCustomers } = formData;

  useEffect(() => {
    fetchCustomers(currentPage, search, tiers, status, pageSize);
  }, [currentPage, search, tiers, status, pageSize]);

  const fetchCustomers = async (page) => {
    try {
      const response = await segCustomer({
        searchKey: search,
        tier: tiers,
        isActive: status,
        page: page,
        size: pageSize,
      });
      if (response && response.results) {
        const truncatedData = response.results.content.map((item) => ({
          ...item,
          id: item.id.length > 12 ? item.id.substring(0, 12) : item.id,
          fullName:
            item.fullName.length > 12
              ? item.fullName.substring(0, 12)
              : item.fullName,
          phoneNumber:
            item.phoneNumber.length > 12
              ? item.phoneNumber.substring(0, 12)
              : item.phoneNumber,
          address:
            item.address.length > 12
              ? item.address.substring(0, 12)
              : item.address,
          email:
            item.email.length > 12 ? item.email.substring(0, 12) : item.email,
        }));
        setCustomers(truncatedData);
        setOriginalCustomers(truncatedData);
        setFormData({
          ...formData,
          totalCustomers: response.results.totalElements,
        });
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const viewDetails = (id) => {
    dispatch(setId(id));
    setTimeout(() => {
      navigate(`/layout/customer/detail/${id}`);
    }, 100);
  };

  const updateCustomerStatus = (id, isActive) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === id ? { ...customer, isActive } : customer
      )
    );
  };

  const handleApiUpdate = async (id, isActive, setCustomers) => {
    try {
      const response = await isActiveApi(id, isActive);
      if (!response) {
        updateCustomerStatus(id, !isActive, setCustomers);
      }
    } catch (error) {
      console.error("Error updating customer status:", error);
      updateCustomerStatus(id, !isActive, setCustomers);
    }
  };

  const toggleActive = (id, isActive, setCustomers) => {
    showConfirmModal(
      isActive,
      async () => {
        updateCustomerStatus(id, isActive, setCustomers);
        await handleApiUpdate(id, isActive, setCustomers);
      },
      "customer"
    );
  };

  const searchHandle = (value) => {
    setFormData({ ...formData, search: value });
    setCurrentPage(0);
  };

  const tierHandle = (value) => {
    setFormData({ ...formData, tiers: value });
    setCurrentPage(0);
  };

  const statusHandle = (value) => {
    setFormData({ ...formData, status: value });
    setCurrentPage(0);
  };

  const handleOnChangeSearch = (e) => {
    const value = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev, search: value };
      if (!value.trim()) {
        setCustomers(originalCustomers);
        updated.totalCustomers = originalCustomers.length;
      }
      return updated;
    });
  };

  const exportHandle = async (searchValue, filterCustomer, status) => {
    try {
      const response = await exportApi({
        tier: filterCustomer,
        isActive: status,
        searchKey: searchValue,
        page: currentPage,
        size: pageSize,
      });
      const password = downloadFile(response);
      showExportModal(password);
    } catch (error) {
      console.error("Error exporting file:", error);
    }
  };

  const dataSource = customer?.map((item) => ({ ...item, key: item.id }));

  const columns = [
    ...constants.CUSTOMER_LIST,
    {
      title: "Tier",
      dataIndex: "tier",
      align: "center",
      render: (tier) => {
        let colorB = "#EDF1F2";
        let colorF = "#8696A0";

        if (tier === "Bronze") {
          colorB = "#F5F0EB";
          colorF = "#A67C52";
        }
        if (tier === "Diamond") {
          colorB = "#F6E6FB";
          colorF = "#A155B9";
        }
        if (tier === "Gold") {
          colorB = "#FBF1D4";
          colorF = "#D4AF37";
        }

        return (
          <Tag
            color={colorB}
            style={{
              color: colorF,
              borderRadius: "16px",
              fontSize: 15,
              boxSizing: "border-box",
              lineHeight: 1,
              padding: "5px 9px",
            }}
          >
            {tier}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      align: "center",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <Switch
            checked={record.isActive}
            onChange={(checked) => toggleActive(record.id, checked)}
            style={{
              backgroundColor: record.isActive ? "#6055F2" : "#d9d9d9",
            }}
          />
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

  return (
    <div className="flex justify-start min-h-screen p-2.5">
      <div className="w-full bg-white p-[50px] rounded-lg shadow-custom">
        <div style={{ marginBottom: "20px" }}>
          <Breadcrumbs />
          <div className="text-[20px] font-bold">Customer List</div>
        </div>

        <div className="flex justify-between gap-[10px] mb-[20px]">
          <div className="flex items-center gap-2.5 w-full">
            <Input
              placeholder="Search customer by Name, Customer ID"
              className="w-[450px] h-10 rounded-l-[6px] border border-[#ccc]"
              value={search}
              onChange={handleOnChangeSearch}
            />
            <Button
              className="h-10 w-14 bg-[#6055F2] text-white rounded-r-[6px] border-none -ml-[10px]"
              onClick={() => searchHandle(search)}
            >
              <SearchOutlined style={{ fontSize: "24px" }} />
            </Button>
            <SelectComponent
              options={constants.TIER_OPTIONS}
              onChange={tierHandle}
              allLabel="All Tiers"
            />
            <SelectComponent
              options={constants.STATUS_OPTIONS}
              onChange={statusHandle}
              allLabel="All Status"
            />
          </div>

          <Button
            icon={<DownloadOutlined style={{ color: "#6055F2" }} />}
            style={{ height: "40px", borderColor: "#C9C6ED" }}
            onClick={() => exportHandle(search, filterCustomer, status)}
          >
            <span style={{ color: "#6055F2" }}>Export Customer List</span>
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          className="custom-table break-words whitespace-normal"
        />

        <Pagination
          current={currentPage}
          total={totalCustomers}
          pageSize={pageSize}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50"]}
          onChange={(page, pageSize) => {
            setFormData({ ...formData, pageSize: pageSize });
            setCurrentPage(page);
          }}
          showTotal={(total) => `Total ${total} items`}
          className="flex justify-end mt-2.5"
        />
      </div>
    </div>
  );
};

export default CustomerList;
