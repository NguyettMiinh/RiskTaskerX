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
  Collapse,
} from "antd";
import { useEffect, useState } from "react";
import { getPermissions, getRoles, editRoles } from "@/services/roleService";
import { RightOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

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
  const [formEdit, setFormEdit] = useState({
    name: "",
    isActive: "false",
    permissionId: [],
  });
  const [isError, setIsError] = useState("");
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

  const fetchDetail = async () => {
    if (!id) return;
    try {
      const response = await getRoles(id);
      const data = response.data.results;
      setDetail(data);
      setFormEdit({
        name: data.name || "",
        isActive: data.isActive ?? false,
        permissionId: data.permissions?.map((item) => item.id) || [],
      });
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

  const permissionIds = detail?.permissions?.map((item) => item.id) || [];

  // const checkAll = selectedCategory?.children?.every((item) =>
  //   formEdit.permissionId.includes(item.id)
  // );
  const checkAll =
    selectedCategory?.children?.length > 0 &&
    selectedCategory.children.every((item) =>
      formEdit.permissionId.includes(item.id)
    );

  const navigate = useNavigate();
  function handleCancel() {
    navigate("/layout/role-list");
  }

  const handleSave = async () => {
    try {
      await editRoles(
        id,
        formEdit.name,
        formEdit.isActive,
        formEdit.permissionId
      );
      navigate("/layout/role-list");
      toast.success("Changes have been saved successfully!");
    } catch (error) {
      const message = error.response?.data?.message;
      if (message === "role-name-exists") {
        setIsError("This role name is already taken.");
      }
      if (message === "invalid-valid-name") {
        setIsError("Role Name is required.");
      }
    }
  };
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
          <div style={{ fontSize: 20, fontWeight: "bold", paddingTop: "8px" }}>
            Role Details
          </div>
        </div>

        <Row
          style={{
            paddingBottom: "30px",
          }}
        >
          <Col span={8}>
            <div
              style={{
                paddingBottom: "10px",
              }}
            >
              {" "}
              <Typography.Text strong className="text-[16px]">
                Role Name
              </Typography.Text>
            </div>

            <Input
              placeholder="Enter role name"
              size="large"
              className="text-14px"
              status={isError ? "error" : ""}
              value={formEdit.name}
              onChange={(e) => {
                setFormEdit({ ...formEdit, name: e.target.value });
                setNameError("");
              }}
            />
            {isError && <div style={{ color: "red" }}>{isError}</div>}
          </Col>
          <Col span={12} offset={2}>
            <Typography.Text strong className="text-[16px]">
              Status
            </Typography.Text>

            <div className="pt-[12px]">
              <Switch
                checked={formEdit.isActive}
                onChange={(checked) =>
                  setFormEdit({ ...formEdit, isActive: checked })
                }
                style={{
                  backgroundColor: formEdit.isActive ? "#6055F2" : "#d9d9d9",
                  marginRight: "5px",
                }}
              />
              <span>{formEdit?.isActive ? "Active" : "Inactive"}</span>
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
                    <div>
                      <Checkbox
                        checked={checkAll}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const allIds = selectedCategory.children.map(
                            (child) => child.id
                          );

                          const updatedPermissions = checked
                            ? Array.from(
                                new Set([...formEdit.permissionId, ...allIds])
                              ) // tránh trùng ID
                            : formEdit.permissionId.filter(
                                (id) => !allIds.includes(id)
                              );

                          setFormEdit({
                            ...formEdit,
                            permissionId: updatedPermissions,
                          });
                        }}
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
                        <Checkbox
                          checked={formEdit.permissionId.includes(child.id)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            const updatedPermissions = checked
                              ? [...formEdit.permissionId, child.id]
                              : formEdit.permissionId.filter(
                                  (id) => id !== child.id
                                );

                            setFormEdit({
                              ...formEdit,
                              permissionId: updatedPermissions,
                            });
                          }}
                        >
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
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default DetailRole;
