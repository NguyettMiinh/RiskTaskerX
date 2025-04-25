import { Tabs } from "antd";
import Personal from "./Personal";
import Purchase from "./Purchase";
import Warranty from "./Warranty";
import Breadcrumbs from "@components/ui/Breadcrumbs";
import "@assets/styles/customTabs.css";

const DetailCustomer = () => {

  const items = [
    {
      key: "1",
      label: "Purchase history",
      children: <Purchase />,
    },
    {
      key: "2",
      label: "Warranty history",
      children: <Warranty />,
    },
  ];

  return (
    <div className="flex justify-start min-h-screen p-2.5">
      <div className="w-full bg-white p-[33px] rounded-lg shadow-custom">
        <div className="mb-[20px]">
          <Breadcrumbs />
          <div className="text-[20px] font-bold">Customer Details</div>
        </div>
        <div className="flex">
          <Personal />
          <div className="pl-[40px]">
            <Tabs defaultActiveKey="1" items={items} />
          </div>
        </div>
      </div>
    </div>

  );
};

export default DetailCustomer;
