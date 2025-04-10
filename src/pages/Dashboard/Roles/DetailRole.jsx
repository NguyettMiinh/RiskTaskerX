import { RightOutlined } from "@ant-design/icons";
import Breadcrumbs from "@components/ui/Breadcrumbs";
import {
  Button,
  Card,
  Checkbox,
  Input,
  Switch,
  Typography,
  Row,
  Col,
} from "antd";
import React, { useState } from "react";
import { Link } from "react-router";

const permissionsData = [
  {
    module: "Dashboard",
    permissions: ["View Dashboard"]
  },
  {
    module: "Roles & Permissions",
    permissions: [
      "View Role & Admin Management",
      "Detail Role & Admin Management",
      "Add Role & Admin Management",
      "Edit Role & Admin Management"
    ]
  },
  {
    module: "Customer Management",
    permissions: [
      "View Customer Management",
      "Detail Customer Management",
      "Add Customer Management",
      "Edit Customer Management"
    ]
  },
  
]

function DetailRole() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        minHeight: "100vh",
        padding: "10px",
      }}
    >
      <div
        style={{
          width: "100%",
          background: "#fff",
          padding: "50px",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Breadcrumb & Title */}
        <div style={{ marginBottom: "20px" }}>
          <Breadcrumbs/>
          <div style={{ fontSize: 30, fontWeight: "bold", paddingTop: "8px" }}>
            Role Detail
          </div>
        </div>

        <Row>
          <Col span={8}>
            <div
              style={{
                display: "flex"
              }}
            >
              <div>
                <Typography.Text strong>Role Name</Typography.Text>
                <Input placeholder="Enter role name" size="large" />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "20px" }}>
             
              <div
                style={{
                  border: "1px solid #eee",
                  borderRadius: "10px",
                  width: "510px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #eee",
                    padding: "18px 20px",
                    backgroundColor: "#EBEAFA",
                    color: "#6055F2",
                    fontWeight: "500",
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                  }}
                >
                  Management Categories
                </div>
              </div>
            </div>
          </Col>
          <Col span={12} offset={4}>
            <div>
              <div>
                <Typography.Text strong>Status</Typography.Text>

                <div style={{
                  paddingTop: "5px"
                }}>
                  <Switch /> <span>Active</span>
                </div>
              </div>
              <div style={{
                paddingTop: "30px"
              }}>
                <Card
                  title="Permission"
                  styles={{ header: { background: "#EBEAFA" } }}
                  style={{ width: "100%"}}
                >
                  
                </Card>
              </div>
              

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "10px",
                }}
              >
                <Button
                  style={{
                    marginTop: "10px",
                    backgroundColor: "#6055F2",
                    color: "white",
                  }}
                >
                  Add Now
                </Button>
              </div>
            </div>
            
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default DetailRole;
