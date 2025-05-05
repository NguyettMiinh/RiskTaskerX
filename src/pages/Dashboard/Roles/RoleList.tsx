// Import thư viện ngoài
import { Button, Input, Pagination, Table, Switch } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
// Import nội bộ
import SelectComponent from "../../../components/ui/SelectComponent";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import constants from "../../../constants";
import useRole from "./hook/useRole";
import { Role } from "../../../types/Role";
import { ColumnsType } from "antd/es/table";



function RoleList() {

  const {
    search,
    totalRoles,
    totalPages,
    originalRoles,
    dataSource,
    currentPage,
    pageSize,
    handleRole,
    setSearch,
    handleTable,
    searchHandle,
    statusHandle,
    setRoles,
    setPageSize,
    setTotalRoles,
    setCurrentPage,
    toggleActive,
    viewDetails,
    handleDelete
  } = useRole();


  const columns: ColumnsType<Role> = [
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
      render: (_: Role, record: Role) => (
        <div
          className="flex items-center justify-center [gap:10px]"

        >
          <Switch
            checked={record.isActive ?? false}
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
            onClick={() => handleDelete(record.id)}
          />
        </div>
      ),
    },
  ];
  
  return (
    <div className="flex justify-start min-h-screen p-2.5">
      <div className="w-full bg-white p-[33px] rounded-[8px] shadow-[0px_4px_10px_rgba(0,_0,_0,_0.15)]">
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
                  setRoles(originalRoles);
                  setTotalRoles(originalRoles.length);
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

            <SelectComponent<boolean>
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

        { totalPages > 0 &&
         <Pagination
          current={currentPage}
          total={totalRoles}
          pageSize={pageSize}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50"]}
          onChange={(page, pageSize) => {
            setPageSize(pageSize);
            setCurrentPage(page);
          }}
          showTotal={(total) => `Total ${total} items`}
          hideOnSinglePage={false}
          className="flex justify-end mt-2.5"
        />}
      </div>
    </div>
  );
}

export default RoleList;
