import {
  DownloadOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import SelectComponent from "@components/ui/SelectComponent";
import { Button, Input, Pagination, Switch, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import constants from "../../../constants";
import "../../../assets/styles/admin.css";
import { Admin, columnAdminFields, FieldColumn } from "../../../types/Admin";
import { COLOR } from "../../../constants/ColorKey";
import Breadcrumbs from "@components/ui/Breadcrumbs";
import AddAdminModal from "./AddAdminModal";
import useAdmin from "./hook/useAdmin";
import { PageName } from "../../../constants/Variable";

export default function AdminManagementList() {
  const {
    viewDetails,
    exportHandle,
    filterDepartmentHandle,
    filterStatusHandle,
    handleAdd,
    handleTable,
    onSuccess,
    searchHandle,
    toggleActive,
    setAdmins,
    setSearch,
    setTotalAdmins,
    setCurrentPage,
    setPageSize,
    totalAdmins,
    pageSize,
    totalPages,
    currentPage,
    loading,
    originalAdmin,
    search,
    admins,
  } = useAdmin();
  /// columns data
  const columns: ColumnsType<Admin> = [
    ...columnAdminFields.map((field: FieldColumn) => ({
      ...field,
      key: Array.isArray(field.dataIndex)
        ? field.dataIndex[0]
        : field.dataIndex,
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
              backgroundColor: record.isActive ? COLOR.blue : COLOR.hexGray85,
            }}
          />
          <Button
            type="link"
            icon={
              <EyeOutlined
                style={{ fontSize: "30px", color: COLOR.hexGray75 }}
              />
            }
            onClick={() => viewDetails(record.id)}
          />
        </div>
      ),
      responsive: ["xs", "sm", "md", "lg", "xl"],
    },
  ];

  return (
    <div className="flex justify-start min-h-screen p-2.5">
      <div className="w-full bg-white p-12 rounded-[8px] shadow-[0px_4px_10px_rgba(0,_0,_0,_0.15)]">
        <div className="mb-5">
          <Breadcrumbs />
          <div className="text-[20px] font-bold">{PageName.accountList}</div>
        </div>

        <div className="flex gap-2.5 mb-5 justify-between">
          <div className="flex items-center gap-2.5 w-full">
            <Input
              placeholder="Search admin by Name, Admin ID"
              className="w-full sm:w-72 h-10"
              onChange={(e) => {
                setSearch(e.target.value);
                if (!e.target.value.trim()) {
                  setAdmins(originalAdmin);
                  setTotalAdmins(originalAdmin.length);
                }
              }}
            />
            <Button
              type="primary"
              style={{ background: "rgb(96, 85, 242)" }}
              className="-ml-5 h-10 rounded-s-none"
              onClick={() => searchHandle(search)}
            >
              <SearchOutlined className="text-[24px] " />
            </Button>

            <SelectComponent
              className="w-full sm:w-40"
              options={constants.DEPARTMENT_LIST}
              onChange={filterDepartmentHandle}
              allLabel="All Departments"
            />
            <SelectComponent
              className="w-full sm:w-[110px]"
              options={constants.STATUS_OPTIONS}
              allLabel="All Status"
              onChange={filterStatusHandle}
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              icon={<DownloadOutlined style={{ color: COLOR.blue }} />}
              style={{ height: "40px", borderColor: COLOR.grayishBlue }}
              onClick={() => exportHandle()}
            >
              <span style={{ color: COLOR.blue }}>{PageName.exportText}</span>
            </Button>
            <Button
              className="h-[40px]"
              style={{
                background: COLOR.blue,
                borderColor: COLOR.grayishBlue,
              }}
              icon={<PlusOutlined style={{ color: "#fff" }} />}
              onClick={handleAdd}
            >
              <span style={{ color: "#fff" }}>{PageName.addAdminText}</span>
            </Button>
            <AddAdminModal onSuccess={onSuccess} />
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <Table
            columns={columns}
            dataSource={admins}
            loading={loading}
            pagination={false}
            locale={{ emptyText: "No admin matched your search. Try again." }}
            onChange={handleTable}
            className="table-admin-list border-b-0"
            scroll={{ x: "max-content" }}
            rowKey="id"
          />
        </div>
        {totalPages > 0 && (
          <Pagination
            current={currentPage}
            total={totalAdmins}
            showTotal={(total) => `Total ${total} items`}
            pageSize={pageSize}
            showSizeChanger
            pageSizeOptions={["5", "10", "20", "50"]}
            onChange={(page, pageSize) => {
              setPageSize(pageSize);
              setCurrentPage(page);
            }}
            className="flex justify-end mt-[10px]"
          />
        )}
      </div>
    </div>
  );
}
