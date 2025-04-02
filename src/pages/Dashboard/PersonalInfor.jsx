import React, { useEffect, useState } from "react";
import { Row, Col, Card, Switch, Modal } from "antd";
import avt from "@assets/images/maomao.jpg";
import { getPurchase, isActiveApi } from "@/services/customerService";
import { useSelector } from "react-redux"; 
import { ExclamationCircleFilled, TrophyOutlined } from "@ant-design/icons";

const PersonalInfor = () => {
    const [detail, setDetail] = useState(null);
    const id = useSelector((state) => state.user.id);
    console.log("id",id);
    useEffect(() => {
        const fetchDetail = async () => {
            if (!id) return;
            try {
                const response = await getPurchase(id);
                if (response.data && response.data.length > 0) {
                    setDetail(response.data[0]); 
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchDetail();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return "Invalid Date";  
        const date = new Date(dateStr);
        if (isNaN(date)) return "Invalid Date";  
    
        return date.toLocaleDateString("en-US", {
            month: "short", // "Mar"
            day: "numeric", // "7"
            year: "numeric", // "2000"
        });
    };
      // put isActive
    const toggleActive = (id, isActive) => {
        Modal.confirm({
        icon: null,
        content:  (
            <div style={{ textAlign: "center" }}>
            <ExclamationCircleFilled
                style={{ color: "#FAAD14", fontSize: "40px", marginBottom: "10px" }}
            />
            <div style={{fontSize: "15px"}}>
                {isActive
                ? "Are you sure you want to activate this customer?"
                : "Are you sure you want to deactivate this customer?"}
            </div>
            </div>
        ),
        okText: "Confirm",
        cancelText: "Cancel",
        okButtonProps: {
            style: { backgroundColor: "#6055F2", borderColor: "#6055F2", color: "#fff" },
        },
        onOk: async() => {
            setDetail((prevDetail) => ({
                ...prevDetail,
                customer: {
                    ...prevDetail.customer,
                    isActive: isActive
                }
            }));

            try {
            const response = await isActiveApi(id, isActive);
        
            if (!response) {
                setDetail((prevDetail) => ({
                    ...prevDetail,
                    customer: {
                        ...prevDetail.customer,
                        isActive: !isActive
                    }
                }));
            }
            } catch (error) {
                console.error("Error updating customer status:", error);
                setDetail((prevDetail) => ({
                    ...prevDetail,
                    customer: {
                        ...prevDetail.customer,
                        isActive: !isActive
                    }
                }));
            }
        },
        });

    };
    return (
        <Card 
            title="Personal Information"
            styles={{ header: { background: "#1E4C8F", color: "white" } }} 
            style={{
                width: 385,
                background: "white",
                height: "1000px",
                filter: "drop-shadow(0px 4px 5px rgba(0, 0, 0, 0.25))"
                
            }}
        >
            {/* Image & Basic Info */}
            <Row gutter={[16,16]} style={{ marginBottom: "30px" }}>
                <Col span={12}>
                    <img src={avt} style={{ width: 105, height: 105, borderRadius: "50%" }} />
                </Col>
                <Col span={12} style={{ display: "flex" }}>
                    <Row style={{
                            color: "#5A607F"
                        }}>
                        
                        <Col span={24} style={{
                            fontWeight: "bold",
                            fontSize: "18px",
                        }}>{detail ? detail.customer.fullName : "Loading..."}</Col>
                        <Col span={24} > Customer ID: <strong>{detail ? detail.id : "Loading..."}</strong></Col>
                        <Col span={24}>
                        <TrophyOutlined style={{
                            color: "#ABABAB",
                            paddingRight: "10px"
                        }} />
                        {detail ? detail.customer.tier : "Loading..."} member</Col>
                        <Col span={24}>
                            <Switch 
                            checked = {detail?.customer?.isActive}
                            onChange={(checked) => toggleActive(detail?.customer?.id, checked)}
                            style={{
                                backgroundColor: detail?.customer?.isActive ? "#6055F2" : "#d9d9d9",
                                marginRight: "5px",
                              }}
                             /> <span>{detail?.customer?.isActive ? "Active" : "Inactive"}</span>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row gutter={[16,16]}>
                <Col span={24}>
                    <div style={{
                            color: "#5A607F"
                        }}>Date of birth</div>
                    <div>{detail ? formatDate(detail.customer.dateOfBirth) : "Loading..."}</div>
                </Col>
                <Col span={24}>
                    <div style={{
                            color: "#5A607F"
                        }}>Phone number</div>
                    <div>{detail ? detail.customer.phoneNumber : "Loading..."}</div>
                </Col>
                <Col span={24}>
                    <div style={{
                            color: "#5A607F",
                        }}>Email Address</div>
                    <div>{detail ? detail.customer.email : "Loading..."}</div>
                </Col>
                <Col span={24}>
                    <div style={{
                            color: "#5A607F"
                        }}>Address</div>
                    <div>{detail ? detail.customer.address : "Loading..."}</div>
                </Col>
            </Row>
        </Card>
    );
};

export default PersonalInfor;
