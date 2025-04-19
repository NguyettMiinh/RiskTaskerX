import React, { useState, useEffect } from "react";
import { Table, Pagination, Input, Button, Switch, Modal, Tag } from "antd";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setId } from "@/redux/userSlice";
import constants from "@/constants/index";
import { downloadFile } from "@/utils/exportUtils";
import { showExportModal } from "@/utils/modalUtils";
import {
  SearchOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  exportApi,
  isActiveApi,
  segCustomer,
} from "@/services/customerService";
import "@assets/styles/list.css";
import "@assets/styles/filter.css";
import { showConfirmModal } from "@/utils/showConfimModal";
import SelectComponent from "@components/ui/SelectComponent";
import Breadcrumbs from "@components/ui/Breadcrumbs";
const CustomerList = () => {
  const [customer, setCustomers] = useState([]);
  const [originalCustomers, setOriginalCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState(null);
  const [filterCustomer, setFilterCustomer] = useState([]);
  const [status, setStatus] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);

  const pageSize = 10;

  useEffect(() => {
    fetchCustomers(currentPage, search, filterCustomer, status);
  }, [currentPage, search, filterCustomer, status]);

  const fetchCustomers = async (page, searchValue, filterCustomer, status) => {
    try {
      const response = await segCustomer({
        searchKey: searchValue,
        tier: filterCustomer,
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
        setTotalCustomers(response.results.totalElements || 0);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const viewDetails = (id) => {
    dispatch(setId(id));
    setTimeout(() => {
      navigate(`/layout/customer/detail/${id}`);
    }, 100);
  };

  /// columns data
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

  // put isActive
  const toggleActive = (id, isActive, setCustomers) => {
    showConfirmModal(isActive, async () => {
      updateCustomerStatus(id, isActive, setCustomers);
      await handleApiUpdate(id, isActive, setCustomers);
    }, "customer");
  };

  /// search customer
  const searchHandle = (searchValue) => {
    setSearch(searchValue);
    setCurrentPage(0);
  };

  ///filter tier
  const filterHandle = (value) => {
    setFilterCustomer(value);
    setCurrentPage(0);
  };

  //filter status
  const statusHandle = (value) => {
    setStatus(value);
    setCurrentPage(0);
  };

  /// export file
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
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <Breadcrumbs />
          <div style={{ fontSize: 20, fontWeight: "bold" }}>Customer List</div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
            }}
          >
            <Input
              placeholder="Search customer by Name, Customer ID"
              style={{
                width: "450px",
                height: "40px",
                borderRadius: "6px 0 0 6px",
                border: "1px solid #ccc",
              }}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (!e.target.value.trim()) {
                  setCustomers(originalCustomers);
                  setTotalCustomers(originalCustomers.length);
                }
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
              onClick={() => searchHandle(search)}
            >
              <SearchOutlined style={{ fontSize: "24px" }} />
            </Button>
            <SelectComponent
              options={constants.TIER_OPTIONS}
              onChange={filterHandle}
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
          className="custom-table"
          style={{
            wordWrap: "break-word",
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }}
        />

        <Pagination
          current={currentPage}
          total={totalCustomers}
          pageSize={pageSize}
          onChange={(page) => {
            setCurrentPage(page);
            fetchCustomers(page, search, filterCustomer, status);
          }}
          showTotal={(total) => `Total ${total} items`} 
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "10px",
          }}
        />
      </div>
    </div>
  );
};

export default CustomerList;
