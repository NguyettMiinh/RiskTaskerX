import React, { useEffect, useState } from 'react'
import { EyeOutlined } from '@ant-design/icons';
import { getPurchase } from '@/services/customerService';
import { useSelector } from 'react-redux';
import { Table , Button} from 'antd';
const PurchaseHis = () => {
  const [purchase, setPurchase] = useState();
  const id = useSelector((state) => state.user.id);

  useEffect(() => {
      const fetchPurchase = async () => {
        const result = await getPurchase(id);
        setPurchase(result.data);
      }
      fetchPurchase();
  },[])
  /// columns data
  const columns = [
    { title: "Car model", dataIndex: "carModel" },
    { title: "VIN", dataIndex: "vehicleIdentificationNumber" },
    { title: "Price", dataIndex: "price" },
    { title: "Payment method", dataIndex: "paymentMethod" },
    { title: "Purchase date", dataIndex: "purchaseDate" },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <div>       
          <Button
            type="link"
            icon={
              <EyeOutlined style={{ fontSize: "20px", color: "#BFBFBF" }} />
            }
            onClick={() => viewDetails(record.id)}
          />
        </div>
      ),
    },
  ];
  return (
    <div>
       <Table
          columns={columns}
          dataSource={purchase}
          className="custom-table"
        />
    </div>
  )
}

export default PurchaseHis;
