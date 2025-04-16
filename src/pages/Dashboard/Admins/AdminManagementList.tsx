import {
  DownloadOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import SelectComponent from "@components/ui/SelectComponent";
import { Button, Input, Pagination, Switch, Table, Tag } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import constants from "../../../constants";
import "../../../assets/styles/admin.css";
import {
  Admin,
  AdminSearchAndFilterRequest,
  columnAdminFields,
  FieldColumn,
} from "../../../types/Admin";
import { showConfirmModal } from "../../../utils/showConfimModal";
import { COLOR } from "../../../constants/ColorKey";
import { downloadFile } from "../../../utils/exportUtils";
import { showExportModal } from "../../../utils/modalUtils";
import Breadcrumbs from "@components/ui/Breadcrumbs";
import adminService from "../../../services/adminService";
import { formatTime } from "../../../utils/formatTime";
import {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from "antd/es/table/interface";
import { SORTBYASC, SORTBYDESC } from "../../../constants/Variable";
import ROUTERPATH from "../../../constants/routerConstants";
import { useModalStore } from "../../../utils/modalStore";
import AddAdminModal from "./AddAdminModal";
import dayjs from "dayjs";

export default function AdminManagementList() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<Admin[]>([]);
  const [originalAdmin, setOriginalAdmin] = useState<Admin[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [filterStatus, setFilterRoleAdmin] = useState<boolean[]>([]);
  const [filterDepartmentAdmin, setFilterDepartmentAdmin] = useState<string[]>(
    []
  );
  const [totalAdmins, setTotalAdmins] = useState<number>(0);
  const [sortField, setSortField] = useState<string | undefined>("");
  const [sortOrder, setSortOrder] = useState<
    typeof SORTBYASC | typeof SORTBYDESC | ""
  >("");
  const [loading, setLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const totalPages = Math.ceil(totalAdmins / pageSize);
  const { openModal } = useModalStore();

  const payload: AdminSearchAndFilterRequest = {
    sortKey: sortField ? sortField : "id",
    filters: {
      searchKey: search,
      departmentName: filterDepartmentAdmin,
      isActive: filterStatus,
    },
    page: currentPage,
    size: pageSize,
    sortBy: sortOrder ? sortOrder : SORTBYASC,
  };

  // put isActive
  const toggleActive = (id?: number, isActive?: boolean, setAdmin?: Admin) => {
    showConfirmModal(isActive, async () => {
      console.log("show modal");
    });
  };
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

  ///filter tier
  const filterRoleHandle = (value: boolean[]) => {
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
    navigate(`${ROUTERPATH.detailAdmin}/${id}`);
  };

  /// export file
  const exportHandle = async () => {
    try {
      const response = await adminService.exportAdmin(payload);
      console.log(response);

      const password = downloadFile(response);
      showExportModal(password);
    } catch (error) {
      console.error("Error exporting file:", error);
    }
  };

  const handleTable = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Admin> | SorterResult<Admin>[],
    extra: TableCurrentDataSource<Admin>
  ) => {
    const sort = Array.isArray(sorter) ? sorter[0] : sorter;

    if (sort && sort.order && sort.field) {
      const { field, order } = sort;
      setSortField(field as string);
      setSortOrder(order === "ascend" ? SORTBYASC : SORTBYDESC);
    } else {
      setSortField("id");
      setSortOrder(SORTBYASC);
    }
  };

  useEffect(() => {
    if (currentPage > totalPages && currentPage > 1) {
      setCurrentPage(totalPages);
    }
    fetchData();
  }, [
    currentPage,
    search,
    filterStatus,
    filterDepartmentAdmin,
    sortField,
    sortOrder,
    pageSize,
    totalPages,
    totalAdmins,
  ]);
  console.log(filterDepartmentAdmin);
  console.log(filterStatus);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await adminService.searchAndFilterAdmin(payload);
      if (response && response) {
        const truncatedData = response.results.content.map((item: Admin) => ({
          ...item,
          fullName:
            item.fullName.length > 12
              ? item.fullName.substring(0, 12)
              : item.fullName,
          email:
            item.email.length > 12 ? item.email.substring(0, 12) : item.email,
          lastLogin: dayjs(item.lastLogin).format('HH:mm DD-MM-YYYY'),
        }));
        setAdmin(truncatedData);
        setOriginalAdmin(truncatedData);
        setTotalAdmins(response.results.totalElements || 0);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching admin list:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="admin-list">
      <div className="admin-item">
        <div className="mb-5">
          <Breadcrumbs />
          <div className="text-[30px] font-bold">Admin Account List</div>
        </div>

        <div className="flex flex-wrap items-center gap-10 mb-5 w-full flex-grow">
          <div className="flex gap-3 flex-grow">
            <Input
              placeholder="Search admin by Name, Admin ID"
              className="w-full sm:w-72 h-10"
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
              className="-ml-5 h-10 rounded-s-none"
              onClick={() => searchHandle(search)}
            >
              <SearchOutlined className="text-[24px]" />
            </Button>

            <SelectComponent
              className="w-full sm:w-40"
              style={{}}
              options={constants.DEPARTMENT_LIST}
              onChange={filterDepartmentHandle}
              allLabel="All Departments"
            />
            <SelectComponent
              className="w-full sm:w-[100px]"
              options={constants.STATUS_OPTIONS}
              allLabel="All Status"
              style={{}}
              onChange={filterRoleHandle}
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              icon={<DownloadOutlined style={{ color: COLOR.blue }} />}
              style={{ height: "40px", borderColor: "#C9C6ED" }}
              onClick={() => exportHandle()}
            >
              <span style={{ color: COLOR.blue }}>Export</span>
            </Button>
            <Button
              className="h-[40px]"
              style={{
                background: COLOR.blue,
                borderColor: "#c9c6ed",
              }}
              icon={<PlusOutlined style={{ color: "#fff" }} />}
              onClick={openModal}
            >
              <span style={{ color: "#fff" }}>Add Admin</span>
            </Button>
            <AddAdminModal/>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <Table
            columns={columns}
            dataSource={admin}
            loading={loading}
            pagination={false}
            locale={{ emptyText: "No admin matched your search. Try again." }}
            onChange={handleTable}
            className="table-admin-list border-b-0"
            scroll={{ x: "max-content"}}
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
