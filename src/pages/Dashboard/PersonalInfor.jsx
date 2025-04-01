import React from "react";
import { Row, Col, Card } from "antd";
import avt from "@assets/images/maomao.jpg";

const PersonalInfor = () => {
  return (
    <Card 
        title="Personal Information"
        headStyle={{ background: "#1E4C8F", color: "white"}}
        style={{width: 385,
            background: "white"
        }}
        
    >
        {/* Image & Basic Info */}
        <Row gutter={[16,16]} style={{ marginBottom: "16px" }}>
            <Col span={12}>
                <img src= {avt} style={{
                    width: 105,
                    height: 105,
                    borderRadius: "50%"



                }} />

            </Col>
            <Col span={12} style={{
                display: "flex"
            }}>
                <Row>
                    <Col span={24}>Mao Mao</Col>
                    <Col span={24}>Customer ID: 0001</Col>
                    <Col span={24}>Silver member</Col>
                    <Col span={24}>Active</Col>
                </Row>
            </Col>
        </Row>
        <Row gutter={[16,16]}>
            <Col span={24}>
                <div>Date of birth</div>
                <div>Mar 7, 2000</div>
            </Col>
            <Col span={24}>
                <div>Phone number</div>
                <div>0388904996</div>
            </Col>
            <Col span={24}>
                <div>Email Address</div>
                <div>nnguyettmiinh@gmai.com</div>
            </Col>
            <Col span={24}>
                <div>Address</div>
                <div>Quan 3, TP. HCM</div>
            </Col>
        </Row>
    </Card>
)};

export default PersonalInfor;
