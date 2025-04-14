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
import { roleSearchFilter, roleActive } from "@/services/roleService";
import { showConfirmModal } from "@/utils/showConfimModal";
import Breadcrumbs from "@components/ui/Breadcrumbs";
import { formatTime } from "@/utils/formatTime";
import { useDispatch } from "react-redux";
import { setId } from "@/redux/userSlice";

function RoleList() {
  const [roles, setRoles] = useState([]);
  const [originalCustomers, setOriginalCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState(null);
  const [status, setStatus] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const pageSize = 10;
  const dataSource = roles?.map((item) => ({ ...item, key: item.id }));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRoles(currentPage, search, status);
  }, [currentPage, search, status, sortField, sortOrder]);

  const fetchRoles = async (page, searchValue, status) => {
    try {
      const response = await roleSearchFilter({
        sortKey: sortField,
        sortBy: sortOrder,
        searchKey: searchValue,
        isActive: status,
        page: page,
        size: pageSize,
      });
      const results = response.data.results.content;
      const newResult = results.map((item) => ({
        ...item,
        updateAt: formatTime(item.updateAt),
      }));

      setRoles(newResult);
      setOriginalCustomers(newResult);
      setTotalCustomers(response.data.results.totalElements || 0);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };
  const dispatch = useDispatch();
  const viewDetails = (id) => {
     dispatch(setId(id));
    setTimeout(() => {
      navigate("/layout/role-list/role-detail");
    }, 100);
  };
  const updateRoleStatus = (id, isActive) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) => (role.id === id ? { ...role, isActive } : role))
    );
  };
  const handleApiUpdate = async (id, isActive, setCustomers) => {
    try {
      const response = await roleActive(id, isActive);
      if (!response) {
        updateRoleStatus(id, !isActive, setCustomers);
      }
    } catch (error) {
      console.error("Error updating customer status:", error);
      updateRoleStatus(id, !isActive, setCustomers);
    }
  };
  // put isActive
  const toggleActive = (id, isActive, setRoles) => {
    showConfirmModal(isActive, async () => {
      updateRoleStatus(id, isActive, setRoles);
      await handleApiUpdate(id, isActive, setRoles);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    });
  };

  const columns = [
    { title: "No", dataIndex: "id", width: "400px"},
    { title: "Role Name", dataIndex: "name", width: "400px"},
    { title: "Last Update", dataIndex: "updateAt", sorter: true, width: "400px"},
    {
      title: "Actions",
      dataIndex: "actions",
      align: "center",
      width: "309px",
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
            disabled={isLoading}
          />
          <Button
            type="link"
            icon={
              <EyeOutlined style={{ fontSize: "30px", color: "#BFBFBF" }} />
            }
            onClick={() => viewDetails(record.id)}
            
          />
        </div>
      ),
    },
  ];

  //sort
  const handleTable = (pagination, filters, sorter) => {
    if (sorter.order) {
      setSortField(sorter.field);
      setSortOrder(sorter.order === "ascend" ? "ASC" : "DESC");
    } else {
      setSortField(null);
      setSortOrder(null);
    }
  };
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
    navigate("/layout/role-list/add-role");
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
         <Breadcrumbs />
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
          dataSource={dataSource}
          onChange={handleTable}
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
