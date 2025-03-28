import React, { useState, useEffect } from "react";
import { Table, Pagination, Input, Button, Dropdown, Switch, Modal } from "antd";
import { SearchOutlined, DownOutlined, DownloadOutlined, EyeOutlined, CopyOutlined } from "@ant-design/icons";
import { exportApi, listCustomer, segCustomer } from "@/services/customerService";
import "@assets/styles/list.css";
import TierSelect from "./component/TierSelect";

const CustomerList = () => {
  const [customer, setCustomers] = useState([]);
  const [originalCustomers, setOriginalCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState(null);
  const [filterCustomer, setFilterCustomer] = useState([]);
  const pageSize = 10;
  const [totalCustomers, setTotalCustomers] = useState(0); 

  useEffect(() => {
    fetchCustomers(currentPage, search, filterCustomer);
  }, [currentPage, search, filterCustomer]);

  const fetchCustomers = async (page, searchValue, selectedValues) => {
    try {
      const response = searchValue
        ? await segCustomer({ searchKey: searchValue, page: page, size: pageSize })
        : selectedValues.length > 0
        ? await segCustomer({ tier: selectedValues, page: page, size: pageSize })
        : await listCustomer({ page: page, size: pageSize });
      console.log(response);
      if (response && response.results) {
        if (searchValue || selectedValues.length > 0) {
          const truncatedData = response.results.content.map((item) => ({
            ...item,
            id: item.id.length > 12 ? item.id.substring(0, 12) : item.id,
            fullName: item.fullName.length > 12 ? item.fullName.substring(0, 12) : item.fullName,
            phoneNumber: item.phoneNumber.length > 12 ? item.phoneNumber.substring(0, 12) : item.phoneNumber,
            address: item.address.length > 12 ? item.address.substring(0, 12) : item.address,
            email: item.email.length > 12 ? item.email.substring(0, 12) : item.email,
            tier: item.tier.length > 12 ? item.tier.substring(0, 12) : item.tier
          }));
          setCustomers(truncatedData);
        } else {
          setCustomers(response.results.content);
          setOriginalCustomers(response.results.content);
        }
        setTotalCustomers(response.results.totalElements || 0);
        
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  /// columns data
  const columns = [
    { title: "Customer ID", dataIndex: "id" },
    { title: "Customer Name", dataIndex: "fullName" },
    { title: "Phone Number", dataIndex: "phoneNumber" },
    { title: "Address", dataIndex: "address" },
    { title: "Email", dataIndex: "email" },
    { title: "Tier", dataIndex: "tier" },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          <Switch checked={record.active} onChange={(checked) => toggleActive(checked, record.id)} />
          <Button
            type="link"
            icon={<EyeOutlined style={{ fontSize: "30px", color: "#BFBFBF" }} />}
            onClick={() => viewDetails(record)}
          />
        </div>
      ),
    },
  ];

  /// search customer
  const searchHandle = (searchValue) => {
    setSearch(searchValue);
    setCurrentPage(0);
  };

  ///filter customer
  const filterHandle = (selectedValues) => {
    console.log(selectedValues);
    setFilterCustomer(selectedValues);
    setCurrentPage(0);
  };

  /// export file
  const exportHandle = async (searchValue, selectedValues) => {
    console.log("Selected values:", searchValue, selectedValues); 
    try {
      const response = await exportApi({tier: selectedValues , searchKey: searchValue , page: currentPage, size: pageSize });

      console.log(response);
      
      const fileName = response.fileName;
      const password = response.password;
      console.log(fileName, password);

      
      const byteCharacters = atob(response.response);
      const byteNumbers = new Uint8Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const blob = new Blob([byteNumbers], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
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
              <div style={{
                fontSize: "15px",
                paddingBottom: "10px",
              }}>Export password</div>
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
                  icon={<CopyOutlined style={{
                    color: "white"
                  }}/>}
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
                    width: "50px"
                  }}
                >
                </Button>
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

  const options = [
    { label: "Diamond", value: "Diamond" },
    { label: "Gold", value: "Gold" },
    { label: "Silver", value: "Silver" },
    { label: "Bronze", value: "Bronze" }
  ];
  const optionStatus = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];



  return (
    <div style={{ display: "flex", justifyContent: "flex-start", minHeight: "100vh", padding: "10px" }}>
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
          <div style={{ fontSize: "21px", paddingBottom: "8px" }}>
            Home /{" "}
            <span>
              <a href="#" style={{ textDecoration: "underline" }}>
                Customer Management
              </a>
            </span>
          </div>
          <div style={{ fontSize: 30, fontWeight: "bold" }}>Customer List</div>
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
                width: "400px",
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

            <TierSelect options={options} onChange={filterHandle} allLabel="All Tier" />
            {/* <TierSelect options={optionStatus} onChange={checkStatus} allLabel="All Status" /> */}
          </div>

          <Button
            icon={<DownloadOutlined style={{ color: "#6055F2" }} />}
            style={{ height: "40px", borderColor: "#C9C6ED" }}
            onClick={() => exportHandle(search)}
          >
            <span style={{ color: "#6055F2" }}>Export Customer List</span>
          </Button>
        </div>

        <Table 
          columns={columns} 
          dataSource={customer.length > 0 ? customer.map(c => ({ ...c, key: c.id })) : []} 
          pagination={false} 
          // scroll={{ x: "max-content" }}
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
            console.log("Pagination changed to:", page);
            setCurrentPage(page);
            fetchCustomers(page, search);
          }}
          style={{ marginTop: "10px", textAlign: "right" }}
        />
      </div>
    </div>
  );
};

export default CustomerList;