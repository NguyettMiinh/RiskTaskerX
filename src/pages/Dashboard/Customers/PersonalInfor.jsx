import { useEffect, useState } from "react";
import { Row, Col, Card, Switch } from "antd";
import { TrophyOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { getWarranty, isActiveApi } from "@/services/customerService";
import { showConfirmModal } from "@/utils/showConfimModal";
import { formatDate } from "@/utils/formatDate";
import avt from "@assets/images/maomao.jpg";

const PersonalInfor = () => {
  const [detail, setDetail] = useState(null);
  const id = useSelector((state) => state.user.id);
  
  const fetchDetail = async () => {
    if (!id) return;
    try {
      const response = await getWarranty({page: 0, customerId:  id});
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
  const handleDetail = async (id, isActive, setDetail) => {
    try {
      const response = await isActiveApi(id, isActive);
      if (!response) {
        updateDetail(!isActive, setDetail);
      }
    } catch (error) {
      console.error("Error updating customer status:", error);
      updateDetail(!isActive, setDetail);
    }
  };
  // put isActive
  const toggleActive = (id, isActive, setCustomers) => {
    showConfirmModal(isActive, async () => {
      updateDetail(isActive, setCustomers);
      await handleDetail(id, isActive, setCustomers);
    });
  };
  return (
    <div>
      <Card
        title="Personal Information"
        styles={{ header: { background: "#1E4C8F", color: "white" } }}
        style={{
          width: 385,
          background: "white",
          height: "1000px",
          filter: "drop-shadow(0px 4px 5px rgba(0, 0, 0, 0.25))",
          minHeight: "100vh",
        }}
      >
        {/* Image & Basic Info */}
        <Row gutter={[16, 16]} style={{ marginBottom: "30px" }}>
          <Col span={8}>
            <img
              src={avt}
              style={{ width: 100, height: 100, borderRadius: "50%" }}
            />
          </Col>
          <Col span={16} style={{ display: "flex" }}>
            <Row
              style={{
                color: "#5A607F",
              }}
            >
              <Col
                span={24}
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
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
                  style={{
                    color: "#ABABAB",
                    paddingRight: "10px",
                  }}
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
              style={{
                color: "#5A607F",
              }}
            >
              Date of birth
            </div>
            <div>
              {detail ? formatDate(detail.customer.dateOfBirth) : "Loading..."}
            </div>
          </Col>
          <Col span={24}>
            <div
              style={{
                color: "#5A607F",
              }}
            >
              Phone number
            </div>
            <div>{detail ? detail.customer.phoneNumber : "Loading..."}</div>
          </Col>
          <Col span={24}>
            <div
              style={{
                color: "#5A607F",
              }}
            >
              Email address
            </div>
            <div>{detail ? detail.customer.email : "Loading..."}</div>
          </Col>
          <Col span={24}>
            <div
              style={{
                color: "#5A607F",
              }}
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

export default PersonalInfor;
