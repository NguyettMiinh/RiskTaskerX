import { useState, useEffect } from "react";
import { Table, Pagination, Input, Button, Switch, Modal, Tag } from "antd";
import constants from "@/constants/index";
import useCustomer from "./hook/useCustomer";
import {
  SearchOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import SelectComponent from "@components/ui/SelectComponent";
import Breadcrumbs from "@components/ui/Breadcrumbs";
import "@assets/styles/list.css";
import "@assets/styles/filter.css";

const CustomerList = () => {
  const {
    currentPage,
    formData,
    dataSource,
    setCurrentPage,
    setFormData,
    searchHandle,
    tierHandle,
    statusHandle,
    handleOnChangeSearch,
    exportHandle,
    viewDetails,
    toggleActive,
  } = useCustomer();

  const { search, tiers, status, pageSize, totalCustomers} = formData;
console.log("formData", formData);
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
              onChange={(e) => handleOnChangeSearch(e)}
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
            onClick={() => exportHandle(search, tiers, status)}
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
