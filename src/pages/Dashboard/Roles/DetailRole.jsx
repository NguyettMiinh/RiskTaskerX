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
  Modal,
  Collapse
} from "antd";
import { useEffect, useState } from "react";
import { getPermissions, addRoles } from "@/services/roleService";
import { RightOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { getRoles } from "@/services/roleService";
const { Panel } = Collapse;
function DetailRole() {
  const [categories, setCategories] = useState([]);
  const [value, setValue] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [childCategory, setChildCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detail, setDetail] = useState([]);
  const id = useSelector((state) => state.user.id);

  const fetchPermissions = async () => {
    try {
      const response = await getPermissions();
      setCategories(response.data.results);
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    }
  };
  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchDetail = async () => {
    if (!id) return;
    try {
      const response = await getRoles(id);
      setDetail(response.data.results);
      console.log("response", response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchDetail();
  }, []);

  // Khi chọn category mới:
  const handlePermissions = (category) => {
    if (category.name === "Admin & Role Management") {
      setChildCategory(category.children || []);
      setSelectedCategory(null);
      setPermissions([]);
    } else {
      setSelectedCategory(category);
      setPermissions(category.children || []);
    }
  };

  // const checkAll =  selectedCategory?.children.map((item) => item.name).every(item => detail?.permissions.includes(item));
  const permissionIds = detail?.permissions?.map((item) => item.id) || [];

  const checkAll = selectedCategory?.children?.every((item) =>
    permissionIds.includes(item.id)
  );
  console.log("detail", detail);
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
          <Breadcrumbs />
          <div style={{ fontSize: 30, fontWeight: "bold", paddingTop: "8px" }}>
            Add New Role
          </div>
        </div>

        <Row>
          <Col span={8}>
            <div
              style={{
                display: "flex",
              }}
            >
              <div>
                <Typography.Text strong>Role Name</Typography.Text>
                <Input
                  placeholder="Enter role name"
                  size="large"
                  value={detail?.name}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "20px",
              }}
            >
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
                {categories.map((item) => {
                  if (item.name === "Admin & Role Management") {
                    return (
                      <Collapse
                        key={item.id}
                        expandIcon={({ isActive }) => (
                          <RightOutlined
                            rotate={isActive ? 90 : 0}
                            style={{ color: "#6055F2" }}
                          />
                        )}
                        expandIconPosition="end"
                        style={{
                          backgroundColor:
                            selectedCategory?.id === item.id
                              ? "#F5F5F5"
                              : "white",
                        }}
                      >
                        <Panel
                          header={
                            <div onClick={() => handlePermissions(item)}>
                              {item.name}
                            </div>
                          }
                          key={item.id}
                        >
                          {childCategory.map((child) => (
                            <div key={child.id}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  padding: "20px 20px",
                                  cursor: "pointer",
                                  backgroundColor:
                                    selectedCategory?.id === item.id
                                      ? "#F5F5F5"
                                      : "white",
                                }}
                                onClick={() => handlePermissions(child)}
                              >
                                {child.name}
                                <RightOutlined style={{ color: "#6055F2" }} />
                              </div>
                            </div>
                          ))}
                        </Panel>
                      </Collapse>
                    );
                  }

                  return (
                    <div key={item.id}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "20px 20px",
                          borderBottom: "1px solid #eee",
                          cursor: "pointer",
                          backgroundColor:
                            selectedCategory?.id === item.id
                              ? "#F5F5F5"
                              : "white",
                        }}
                        onClick={() => handlePermissions(item)}
                      >
                        {item.name}
                        <RightOutlined style={{ color: "#6055F2" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Col>
          <Col span={12} offset={4}>
            <div>
              <div>
                <Typography.Text strong>Status</Typography.Text>

                <div
                  style={{
                    paddingTop: "5px",
                  }}
                >
                  <Switch
                    checked={detail?.isActive}
                    onChange={(checked) => toggleActive(checked)}
                    style={{
                      backgroundColor: detail?.isActive ? "#6055F2" : "#d9d9d9",
                      marginRight: "5px",
                    }}
                    loading={isLoading}
                    disabled={isLoading}
                  />{" "}
                  <span>{detail?.isActive ? "Active" : "Inactive"}</span>
                </div>
              </div>
              <div
                style={{
                  paddingTop: "30px",
                }}
              >
                <Card
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>Permissions</div>
                      <div>
                        <Checkbox
                          checked={checkAll}
                          className="custom-checkbox"
                        >
                          Select All
                        </Checkbox>
                      </div>
                    </div>
                  }
                  styles={{ header: { background: "#EBEAFA" } }}
                  style={{ width: "100%" }}
                >
                  {selectedCategory?.children?.length > 0 ? (
                    <>
                      {selectedCategory.children.map((child) => (
                        <div
                          key={child.id}
                          style={{
                            paddingBottom: "10px",
                          }}
                        >
                          <Checkbox checked={permissionIds.includes(child.id)}>
                            {" "}
                            {child.name}
                          </Checkbox>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div>No permissions available</div>
                  )}
                </Card>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default DetailRole;
