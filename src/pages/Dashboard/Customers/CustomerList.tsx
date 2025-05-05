import { Table, Pagination, Input, Button, Switch, Modal, Tag } from "antd";
import useCustomer from "./hook/useCustomer";
import constants from "../../../constants/index";
import {
  SearchOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import SelectComponent from "@components/ui/SelectComponent";
import Breadcrumbs from "@components/ui/Breadcrumbs";
import "@assets/styles/list.css";
import "@assets/styles/filter.css";
import { Customer } from "types/Customer";
import { ColumnsType } from "antd/es/table";
import { AlignType } from 'rc-table/lib/interface';
import { OptionType } from "types/Select";


const CUSTOMER_LIST: ColumnsType<Customer> = [
  { title: "Customer ID", dataIndex: "id" },
  { title: "Customer Name", dataIndex: "fullName" },
  { title: "Phone Number", dataIndex: "phoneNumber" },
  { title: "Address", dataIndex: "address" },
  { title: "Email", dataIndex: "email" },
]

const TIER_OPTIONS: OptionType[] = [
  { label: "Diamond", value: "Diamond" },
  { label: "Gold", value: "Gold" },
  { label: "Silver", value: "Silver" },
  { label: "Bronze", value: "Bronze" },
];

const CustomerList = () => {
  const {
    search,
    pageSize,
    totalCustomers,
    currentPage,
    dataSource,
    totalPages,
    originalCustomers,
    setPageSize,
    statusHandle,
    setSearch,
    setCustomers,
    setTotalCustomers,
    setCurrentPage,
    searchHandle,
    tierHandle,
    exportHandle,
    viewDetails,
    toggleActive,
  } = useCustomer();


  const columns = [
    ...CUSTOMER_LIST,
    {
      title: "Tier",
      dataIndex: "tier",
      align: "center" as AlignType,
      render: (tier: string) => {
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
            style={{ color: colorF }}
            className="rounded-[16px] text-[15px] box-border leading-[1] py-[5px] px-[9px]"
          >
            {tier}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      align: "center" as AlignType,
      render: (_: Customer, record: Customer) => (
        <div
          className="flex items-center justify-center gap-[10px]"

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
              <EyeOutlined style={{ fontSize: "25px", color: "#BFBFBF" }} />
            }
            onClick={() => viewDetails(record.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex justify-start min-h-screen p-2.5">
      <div className="w-full bg-white p-[33px] rounded-lg shadow-custom">
        <div className="mb-[20px]">
          <Breadcrumbs />
          <div className="text-[20px] font-bold">Customer List</div>
        </div>

        <div className="flex justify-between gap-[10px] mb-[20px]">
          <div className="flex items-center gap-2.5 w-full">
            <Input
              placeholder="Search customer by Name, Customer ID"
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
              className="h-[40px] w-[56px] bg-[#6055F2] text-white rounded-[0_6px_6px_0] border-none -ml-[10px]"
              onClick={() => searchHandle(search)}
            >
              <SearchOutlined style={{ fontSize: "24px" }} />
            </Button>
            <SelectComponent
              options={TIER_OPTIONS}
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
            onClick={() => exportHandle()}
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

        {totalPages > 0 &&
          <Pagination
            current={currentPage}
            total={totalCustomers}
            pageSize={pageSize}
            showSizeChanger
            pageSizeOptions={["5", "10", "20", "50"]}
            onChange={(page: number, pageSize: number) => {
              setPageSize(pageSize);
              setCurrentPage(page);
            }}
            showTotal={(total) => `Total ${total} items`}
            className="flex justify-end mt-2.5"
          />}
      </div>
    </div>
  );
};

export default CustomerList;
