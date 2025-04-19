// Import thư viện ngoài
import { useState, useEffect } from "react";
import { Button, Input, Pagination, Table, Switch } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";

// Import nội bộ
import SelectComponent from "@/components/ui/SelectComponent";
import Breadcrumbs from "@components/ui/Breadcrumbs";
import constants from "@/constants";
import { roleSearchFilter, roleActive } from "@/services/roleService";
import { showConfirmModal } from "@/utils/showConfimModal";
import { formatTime } from "@/utils/formatTime";
import { setId } from "@/redux/userSlice";

// Import style

function RoleList() {
  const [roles, setRoles] = useState([]);
  const [originalRoles, setOriginalRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const dataSource = roles?.map((item) => ({ ...item, key: item.id }));
  const [formData, setFormData] = useState({
    search: "",
    status: [],
    sortField: "",
    sortOrder: "ASC",
    pageSize: 10,
    totalRoles: 0,
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { search, status, sortField, sortOrder, pageSize, totalRoles } =
    formData;
    
  useEffect(() => {
    fetchRoles(currentPage, search, status, pageSize, sortField, sortOrder);
  }, [currentPage, search, status, pageSize, sortField, sortOrder]);

  const fetchRoles = async (page) => {
    try {
      const response = await roleSearchFilter({
        sortKey: sortField,
        sortBy: sortOrder,
        searchKey: search,
        isActive: status,
        page: page,
        size: pageSize,
      });
      const results = response.data.results;
      const newResult = results?.content.map((item) => ({
        ...item,
        updateAt: formatTime(item.updateAt),
      }));

      setRoles(newResult);
      setOriginalRoles(newResult);
      setFormData({
        ...formData,
        totalRoles: results.totalElements,
      });
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };


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
  const handleApiUpdate = async (id, isActive, setRoles) => {
    try {
      const response = await roleActive(id, isActive);
      if (!response) {
        updateRoleStatus(id, !isActive, setRoles);
      }
    } catch (error) {
      console.error("Error updating customer status:", error);
      updateRoleStatus(id, !isActive, setRoles);
    }
  };
  // put isActive
  const toggleActive = (id, isActive, setRoles) => {
    showConfirmModal(
      isActive,
      async () => {
        updateRoleStatus(id, isActive, setRoles);
        await handleApiUpdate(id, isActive, setRoles);
        if (isActive) {
          toast.success("Role successfully activated");
        } else {
          toast.success("Role successfully deactivated");
        }
      },
      "role"
    );
  };


  //sort
  const handleTable = (pagination, filters, sorter) => {
    if (sorter.order) {
      setFormData({
        ...formData,
        sortField: sorter.field,
        sortOrder: sorter.order === "ascend" ? "ASC" : "DESC",
      });
    } else {
      setFormData({ ...formData, sortField: null, sortOrder: null });
    }
  };
  /// search customer
  const searchHandle = (value) => {
    setFormData({ ...formData, search: value });
    setCurrentPage(0);
  };
  //status filter
  const statusHandle = (value) => {
    setFormData({ ...formData, status: value });
    setCurrentPage(0);
  };
  const handleOnChangeSearch = (e) => {
    const value = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev, search: value };
      if (!value.trim()) {
        setRoles(originalRoles);
        updated.totalRoles = originalRoles.length;
      }
      return updated;
    });
  };

  function handleRole() {
    navigate("/layout/role-list/add-role");
  }

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
          />
        </div>
      ),
    },
  ];
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
              onChange={(e) => 
                handleOnChangeSearch(e)
              }
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
          total={totalRoles}
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
}

export default RoleList;
