import React, { useState, useEffect } from "react";
import SelectComponent from "@/components/ui/SelectComponent";
import constants from "@/constants";
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Button, Input, Pagination, Table, Switch } from "antd";
import { useNavigate } from "react-router";
import { roleSearchFilter, roleActive } from "@/services/roleService";
import { showConfirmModal } from "@/utils/showConfimModal";
import Breadcrumbs from "@components/ui/Breadcrumbs";
import { formatTime } from "@/utils/formatTime";
import { useDispatch } from "react-redux";
import { setId } from "@/redux/userSlice";
import "../../../index.css";


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
    { title: "No", dataIndex: "id", width: "400px" },
    { title: "Role Name", dataIndex: "name", width: "400px" },
    {
      title: "Last Update",
      dataIndex: "updateAt",
      sorter: true,
      width: "400px",
    },
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
              height: "22px",
            }}
            disabled={isLoading}
          />
          <Button
            type="link"
            icon={
              <EyeOutlined style={{ fontSize: "22px", color: "#BFBFBF" }} />
            }
            onClick={() => viewDetails(record.id)}
          />
          <Button
            type="link"
            icon={
              <DeleteOutlined style={{ fontSize: "22px", color: "#BFBFBF" }} />
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
    <div className="flex justify-start min-h-screen p-2.5">
      <div className="w-full bg-white p-12 rounded-[8px] shadow-[0px_4px_10px_rgba(0,_0,_0,_0.15)]">
        <div className="mb-5">
          <Breadcrumbs />
          <div className="text-[20px] font-bold"> Role List</div>
        </div>

        <div className="flex gap-2.5 mb-5 justify-between">
          <div className="flex items-center gap-2.5 w-full">
            <Input
              placeholder="Search role by Name"
              className="w-[450px] h-[40px] rounded-[6px_0_0_6px] border border-[#ccc]"
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
              className="h-[40px] w-[56px] bg-[#6055F2] text-white rounded-[0_6px_6px_0] border-none -ml-[10px]"
              onClick={() => searchHandle(search)}
            >
              <SearchOutlined style={{ fontSize: "24px" }} />
            </Button>

            <SelectComponent
              options={constants.STATUS_OPTIONS}
              allLabel="All Status"
              onChange={statusHandle}
            />
          </div>

          <Button
            icon={<PlusOutlined className="text-inherit" />}
            className="h-[40px] border border-[#C9C6ED] bg-[#6055F2] text-white 
             hover:bg-white hover:text-[#6055F2] hover:border-[#6055F2]
             transition-colors duration-300"
            onClick={handleRole}
          >
            Add Role
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={dataSource}
          onChange={handleTable}
          pagination={false}
          className="custom-table break-words whitespace-normal"
        />

        <Pagination
          current={currentPage}
          total={totalCustomers}
          pageSize={pageSize}
          onChange={(page) => {
            setCurrentPage(page);
            fetchRoles(page, search, status);
          }}
          className="flex justify-end mt-2.5"
        />
      </div>
    </div>
  );
}

export default RoleList;
