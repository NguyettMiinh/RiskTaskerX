import {
  DownloadOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import SelectComponent from "@components/ui/SelectComponent";
import { Button, Input, Pagination, Switch, Table, Tag } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import constants from "../../constants";
import "../../assets/styles/admin.css";
import { Admin } from "types/Admin";
import { showConfirmModal } from "../../utils/showConfimModal";
import { COLOR } from "../../constants/ColorKey";
import { downloadFile } from "../../utils/exportUtils";
import { showExportModal } from "../../utils/modalUtils";
import Breadcrumbs from "@components/ui/Breadcrumbs";

type FieldColumn = {
  title: string;
  dataIndex: string;
  align: "left" | "center" | "right";
  responsive?: ("xs" | "sm" | "md" | "lg" | "xl" | "xxl")[];
  render?: (text: string, record: any) => React.ReactNode;
  sorter?: (a: any, b: any) => number;
};
const columnFields: FieldColumn[] = [
  { title: "Admin ID", dataIndex: "id", align: "left" },
  { title: "Admin Name", dataIndex: "fullName", align: "left" },
  { title: "Email", dataIndex: "email", align: "left" },
  { title: "Role Name", dataIndex: "roleName", align: "left" },
  { title: "Department", dataIndex: "departmentName", align: "left" },
  { title: "Last Login", dataIndex: "lastLogin", align: "left" },
];

const data: Admin[] = [
  {
    id: 1,
    fullName: "Nguyễn Thị Hồng",
    email: "ng.hong1904@gmail.com",
    lastLogin: "2024-11-04",
    departmentName: "IT",
    roleName: "System Admin",
    isActive: true,
  },
  {
    id: 2,
    fullName: "Nguyễn Hồng",
    email: "ng.hong1904@gmail.com",
    lastLogin: "2024-11-04",
    departmentName: "IT",
    roleName: "System Admin",
    isActive: false,
  },
  {
    id: 3,
    fullName: "Trần Thị Hồng",
    email: "ng.hong1904@gmail.com",
    lastLogin: "2024-11-04",
    departmentName: "Customer",
    roleName: "System Admin",
    isActive: true,
  },
  {
    id: 4,
    fullName: "Lê Thị Hồng",
    email: "ng.hong1904@gmail.com",
    lastLogin: "2024-11-04",
    departmentName: "Sale",
    roleName: "System Admin",
    isActive: false,
  },
];

export default function AdminManagementList() {
  const [admin, setAdmin] = useState<Admin[]>([]);
  const [originalAdmin, setOriginalAdmin] = useState<Admin[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [filterRoleAdmin, setFilterRoleAdmin] = useState<string[]>([]);
  const [filterDepartmentAdmin, setFilterDepartmentAdmin] = useState<string[]>(
    []
  );
  const [totalAdmins, setTotalAdmins] = useState<number>(0);

  const pageSize = 2;

  const navigate = useNavigate();
  // put isActive
  const toggleActive = (id?: number, isActive?: boolean, setAdmin?: Admin) => {
    showConfirmModal(isActive, async () => {
      console.log("show modal");
    });
  };
  /// columns data
  const columns: ColumnsType<Admin> = [
    ...columnFields.map((field) => ({
      ...field,
      key: field.dataIndex,
    })),
    {
      title: "Actions",
      dataIndex: "actions",
      align: "left",
      render: (_: Admin, record: Admin) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Switch
            checked={record.isActive}
            onChange={(checked) => toggleActive(record.id, checked)}
            style={{
              backgroundColor: record.isActive ? COLOR.blue : "#d9d9d9",
            }}
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
      responsive: ["xs", "sm", "md", "lg", "xl"],
    },
  ];

  ///filter tier
  const filterRoleHandle = (value: string[]) => {
    setFilterRoleAdmin(value);
    setCurrentPage(0);
  };

  //filter status
  const filterDepartmentHandle = (value: string[]) => {
    setFilterDepartmentAdmin(value);
    setCurrentPage(0);
  };
  // searchHandle
  const searchHandle = useCallback(
    (value: string) => {
      setSearch(value);
      setCurrentPage(0);
    },
    [search]
  );

  // view detail admin
  const viewDetails = (id: number) => {
    navigate(`/layout/admin/detail/${id}`);
  };

  /// export file
  const exportHandle = async (
    searchValue: string,
    filterRole: string[],
    filterDepartment: string[]
  ) => {
    try {
      const password = downloadFile(admin);
      showExportModal(password);
    } catch (error) {
      console.error("Error exporting file:", error);
    }
  };

  useEffect(() => {
    if (data) {
      const truncatedData = data.map((item) => ({
        ...item,
        fullName:
          item.fullName.length > 2
            ? item.fullName.substring(0, 2) +
              "*".repeat(item.fullName.length - 2)
            : item.fullName,
        email:
          item.email.length > 2
            ? item.email.substring(0, 2) + "*".repeat(item.email.length - 2)
            : item.email,
      }));
      setAdmin(truncatedData);
      setOriginalAdmin(truncatedData);
      setTotalAdmins(data.length || 0);
    }
  }, [currentPage, search, filterRoleAdmin, filterDepartmentAdmin]);

  return (
    <div className="admin-list">
      <div className="admin-item">
        <div style={{ marginBottom: "20px" }}>
          <Breadcrumbs />
          <div style={{ fontSize: 30, fontWeight: "bold" }}>Admin Account List</div>
        </div>

        <div className="toolbar">
          <div className="toolbar-item">
            <Input
              placeholder="Search admin by Name, Admin ID"
              className="search-panel"
              onChange={(e) => {
                setSearch(e.target.value);
                if (!e.target.value.trim()) {
                  setAdmin(originalAdmin);
                  setTotalAdmins(originalAdmin.length);
                }
              }}
            />
            <Button
              type="primary"
              className="btn-search"
              onClick={() => searchHandle(search)}
            >
              <SearchOutlined style={{ fontSize: "24px" }} />
            </Button>

            <SelectComponent
              options={constants.ROLE_LIST}
              onChange={filterRoleHandle}
              allLabel="All Role"
            />
            <SelectComponent
              options={constants.DEPARTMENT_LIST}
              onChange={filterDepartmentHandle}
              allLabel="All Department"
            />

            <Button
              icon={<DownloadOutlined style={{ color: COLOR.blue }} />}
              style={{ height: "40px", borderColor: "#C9C6ED" }}
              onClick={() =>
                exportHandle(search, filterRoleAdmin, filterDepartmentAdmin)
              }
            >
              <span style={{ color: COLOR.blue }}>Export</span>
            </Button>
            <Button
              style={{
                height: "40px",
                background: COLOR.blue,
                borderColor: "#c9c6ed",
              }}
              icon={<PlusOutlined style={{ color: "#fff" }} />}
            >
              <span style={{ color: "#fff" }}>Add Admin</span>
            </Button>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <Table
            columns={columns}
            dataSource={admin}
            pagination={false}
            className="table-admin-list"
            scroll={{ x: "max-content" }}
            rowKey="id"
          />
        </div>

        <Pagination
          current={currentPage}
          total={totalAdmins}
          pageSize={pageSize}
          onChange={(page) => {
            console.log("Pagination changed to:", page);
            setCurrentPage(page);
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
