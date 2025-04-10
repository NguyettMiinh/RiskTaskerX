import React, { useState, useEffect } from "react";
import SelectComponent from "@/components/ui/SelectComponent";
import constants from "@/constants";
import {
  DownloadOutlined,
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button, Input, Pagination, Table, Switch } from "antd";
import { useNavigate } from "react-router";
import { roleSearchFilter } from "@/services/roleService";

function RoleList() {
  const [roles, setRoles] = useState([]);
  const [originalCustomers, setOriginalCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState(null);
  const [status, setStatus] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);

  const pageSize = 10;
  useEffect(() => {
    fetchRoles(currentPage, search, status);
  }, [currentPage, search, status]);

  const fetchRoles = async (page, searchValue, status) => {
    try {
      const response = await roleSearchFilter({
        searchKey: searchValue,
        isActive: status,
        page: page,
        size: pageSize,
      });
      console.log("A", response);
      setRoles(response.data.results.content);
      setOriginalCustomers(response.data.results.content);
      setTotalCustomers(response.data.results.totalElements || 0);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };
    const viewDetails = () => {
      console.log("Hello");
      setTimeout(() => {
        navigate("/layout/role-detail");
      }, 100);
    };
  const columns = [
    { title: "No", dataIndex: "id", align: "center" },
    { title: "Role Name", dataIndex: "name", align: "center" },
    { title: "Last Update", dataIndex: "updateAt", align: "center" },
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
              <EyeOutlined style={{ fontSize: "30px", color: "#BFBFBF" }} />
            }
            onClick={() => viewDetails()}
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
  const statusHandle = (value) => {
    setStatus(value);
    setCurrentPage(0);
  };
  const navigate = useNavigate();
  function handleRole() {
    navigate("/layout/add-role");
  }
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
          <div style={{ fontSize: "21px", paddingBottom: "8px" }}>
            Home /{" "}
            <span>
              <a href="#" style={{ textDecoration: "underline" }}>
                Role Management
              </a>
            </span>
          </div>
          <div style={{ fontSize: 30, fontWeight: "bold" }}> Role List</div>
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
              placeholder="Search role by Name"
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

            <SelectComponent
              options={constants.STATUS_OPTIONS}
              allLabel="All Status"
              style={{
                width: "135px",
              }}
              onChange={statusHandle}
            />
          </div>

          <Button
            icon={<DownloadOutlined style={{ color: "#6055F2" }} />}
            style={{ height: "40px", borderColor: "#C9C6ED" }}
          >
            <span style={{ color: "#6055F2" }}>Export</span>
          </Button>

          <Button
            icon={<PlusOutlined style={{ color: "white" }} />}
            style={{
              height: "40px",
              borderColor: "#C9C6ED",
              backgroundColor: "#6055F2",
            }}
            onClick={handleRole}
          >
            <span style={{ color: "white" }}>Add Role</span>
          </Button>
        </div>

       <Table
            columns={columns}
            dataSource={
            roles.length > 0
                     ? roles.map((c) => ({ ...c, key: c.id }))
                     : []
              }
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
            console.log("Pagination changed to:", page);
            setCurrentPage(page);
            fetchRoles(page, search, status);
          }}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "10px",
          }}
        />
      </div>
    </div>
  );
}

export default RoleList;
