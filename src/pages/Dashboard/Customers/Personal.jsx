import  { useEffect, useState } from "react";
import { Row, Col, Card, Switch, Modal } from "antd";
import avt from "@assets/images/maomao.jpg";
import { getWarranty, isActiveApi } from "@/services/customerService";
import { useSelector } from "react-redux";
import { TrophyOutlined } from "@ant-design/icons";
import { showConfirmModal } from "@/utils/showConfimModal";
import { formatDate } from "@/utils/formatDate";
import { toast } from "react-toastify";

const Personal = () => {
  const [detail, setDetail] = useState(null);
  const id = useSelector((state) => state.user.id);

  const fetchDetail = async () => {
    if (!id) return;
    try {
      const response = await getWarranty({ page: 0, customerId: id });
      if (response.data.content && response.data.content.length > 0) {
        setDetail(response.data.content[0]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  const updateDetail = (isActive) => {
    setDetail((prevDetail) => ({
      ...prevDetail,
      customer: {
        ...prevDetail.customer,
        isActive: isActive,
      },
    }));
  };
  const handleDetail = async (id, isActive) => {
    try {
      const response = await isActiveApi(id, isActive);
      if (!response) {
        updateDetail(!isActive);
      }
    } catch (error) {
      console.error("Error updating customer status:", error);
      updateDetail(!isActive);
    }
  };
  // put isActive
  const toggleActive = (id, isActive) => {
    showConfirmModal({
      onConfirm: async () => {
        updateDetail(isActive);
        await handleDetail(id, isActive);
        if (isActive) {
          toast.success("Customer successfully activated");
        } else {
          toast.success("Customer successfully deactivated");
        }
      },
      name: "customer",
      action: isActive ? "activate" : "deactivate",
    });
  };

  return (
    <div className="min-h-screen">
      <Card
        title="Personal Information"
        styles={{ header: { background: "#1E4C8F", color: "white" } }}
        className="w-[385px] bg-white drop-shadow-lg h-full"
      >
        {/* Image & Basic Info */}
        <Row gutter={[16, 16]} style={{ marginBottom: "30px" }}>
          <Col span={8}>
            <img
              src={avt}
              className="h-[100px] w-[100px] rounded-full"
            />
          </Col>

          <Col span={16} className="flex">
            <Row
              className="text-[#5A607F]"
            >
              <Col
                span={24}
                className="text-[16px] font-bold"
              >
                {detail ? detail.customer.fullName : "Loading..."}
              </Col>
              <Col span={24}>
                {" "}
                Customer ID:{" "}
                <strong>{detail ? detail.customer.id : "Loading..."}</strong>
              </Col>
              <Col span={24}>
                <TrophyOutlined
                  className="text-[#ABABAB] pr-[10px]"
                />
                {detail ? detail.customer.tier : "Loading..."} member
              </Col>

              <Col span={24}>
                <Switch
                  checked={detail?.customer?.isActive}
                  onChange={(checked) =>
                    toggleActive(detail?.customer?.id, checked)
                  }
                  style={{
                    backgroundColor: detail?.customer?.isActive
                      ? "#6055F2"
                      : "#d9d9d9",
                    marginRight: "5px",
                  }}
                />{" "}
                <span>
                  {detail?.customer?.isActive ? "Active" : "Inactive"}
                </span>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <div
              className="text-[#5A607F]"
            >
              Date of birth
            </div>
            <div>
              {detail ? formatDate(detail.customer.dateOfBirth) : "Loading..."}
            </div>
          </Col>
          <Col span={24}>
            <div
              className="text-[#5A607F]"
            >
              Phone number
            </div>
            <div>{detail ? detail.customer.phoneNumber : "Loading..."}</div>
          </Col>
          <Col span={24}>
            <div
              className="text-[#5A607F]"
            >
              Email address
            </div>
            <div>{detail ? detail.customer.email : "Loading..."}</div>
          </Col>
          <Col span={24}>
            <div
              className="text-[#5A607F]"
            >
              Address
            </div>
            <div>{detail ? detail.customer.address : "Loading..."}</div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Personal;
