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
  Collapse,
  Modal
} from "antd";
import { useEffect, useState } from "react";
import { getPermissions, addRoles } from "@/services/roleService";
import { ExclamationCircleFilled, RightOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import "../../../assets/styles/role.css";
import { useNavigate } from "react-router";
const { Panel } = Collapse;

function AddRole() {
  const [categories, setCategories] = useState([]);
  const [value, setValue] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [childCategory, setChildCategory] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [isError, setIsError] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState("");

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

  const handleCheckBox = (value, checked) => {
    if (checked) {
      setValue((prev) => [...prev, value]);
    } else {
      setValue((prev) => prev.filter((item) => item !== value));
    }
  };

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
  const navigate = useNavigate();

  const handleAdd = async () => {
    try {
      await addRoles(name, isActive, value);
      if (name === "") {
        setIsError("Role Name is required.");
        return;
      }
      navigate("/layout/role-list");
      toast.success("New role has been added successfully!");
      setName("");
      setValue([]);
      setSelectedCategory(null);
      setPermissions([]);
      setIsActive(false);
      setIsError("");
    } catch (error) {
      const message = error.response?.data?.message;
      if (message === "role-already-exists") {
        setIsError("This role name is already taken.");
      }
    }
  };

  const toggleActive = async (checked) => {
    if (isLoading) return;
    setIsLoading(true);
    setIsActive(checked);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const checkAll = selectedCategory?.children
    ?.map((item) => item.id)
    .every((id) => value.includes(id));

  const handleAll = (checked) => {
    if (checked) {
      const all = permissions.map((option) => option.id);
      setValue((prev) => [...new Set([...prev, ...all])]);
    } else {
      const idsToRemove = permissions.map((option) => option.id);
      setValue((prev) => prev.filter((id) => !idsToRemove.includes(id)));
    }
  };
function handleCancel() {
  Modal.confirm({
    icon: null,
    content: (
      <div style={{ textAlign: "center" }}>
        <ExclamationCircleFilled
          style={{ color: "#FAAD14", fontSize: "40px", marginBottom: "10px" }}
        />
        <div style={{ fontSize: "15px" }}>
            Are you sure you want to save your changes?
        </div>
      </div>
    ),
    okText: "Ok",
    cancelText: "Cancel",
    okButtonProps: {
      style: {
        backgroundColor: "#6055F2",
        borderColor: "#6055F2",
        color: "#fff",
      },
    },
  });
}
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
        <div></div>
        <Row
          style={{
            paddingBottom: "30px",
          }}
        >
          <Col span={8}>
            <Typography.Text strong>Role Name</Typography.Text>
            <Input
              placeholder="Enter role name"
              size="large"
              value={name}
              status={isError ? "error" : ""}
              onChange={(e) => {
                setName(e.target.value);
                setNameError("");
              }}
            />
            {isError && <div style={{ color: "red" }}>{isError}</div>}
          </Col>
          <Col span={12} offset={4}>
            <Typography.Text strong>Status</Typography.Text>
            <div style={{ paddingTop: "5px" }}>
              <Switch
                checked={isActive}
                onChange={toggleActive}
                style={{
                  backgroundColor: isActive ? "#6055F2" : "#d9d9d9",
                  marginRight: "5px",
                }}
                loading={isLoading}
                disabled={isLoading}
              />
              <span>{isActive ? "Active" : "Inactive"}</span>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div
              style={{
                border: "1px solid #eee",
                borderRadius: "10px",
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
          </Col>
          <Col span={14} offset={2}>
            <div>
              <Card
                title={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>Permissions</div>
                    <Checkbox
                      checked={checkAll}
                      onChange={(e) => handleAll(e.target.checked)}
                      className="custom-checkbox"
                    >
                      Select All
                    </Checkbox>
                  </div>
                }
                styles={{ header: { background: "#EBEAFA" } }}
                style={{ width: "100%" }}
              >
                {selectedCategory?.children?.length > 0 ? (
                  selectedCategory.children.map((child) => (
                    <div key={child.id} style={{ paddingBottom: "10px" }}>
                      <Checkbox
                        onChange={(e) =>
                          handleCheckBox(child.id, e.target.checked)
                        }
                        checked={value.includes(child.id)}
                      >
                        {child.name}
                      </Checkbox>
                    </div>
                  ))
                ) : (
                  <div>No permissions available</div>
                )}
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
                  marginRight: "10px",
                }}
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                style={{
                  marginTop: "10px",
                  backgroundColor: "#6055F2",
                  color: "white",
                }}
                onClick={handleAdd}
              >
                Add Now
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default AddRole;
