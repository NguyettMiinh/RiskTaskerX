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
} from "antd";
import { useState } from "react";
import { addRoles } from "@/services/roleService";
import {RightOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import "../../../assets/styles/role.css";
import { useNavigate } from "react-router";
import { usePermissions } from "@components/hook/usePermissions";
const { Panel } = Collapse;

function AddRole() {
  const [value, setValue] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [childCategory, setChildCategory] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [isError, setIsError] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

 const {data} = usePermissions();
 const categories = data?.data.results;

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
      navigate("/layout/role-list");
      toast.success("New role has been added successfully!");
      setName("");
      setValue([]);
      setSelectedCategory(null);
      setPermissions([]);
      setIsActive(true);
      setIsError("");
    } catch (error) {
      const message = error.response?.data?.message;
      if (message === "role-already-exists") {
        setIsError("This role name is already taken.");
      }
      if (message === "invalid-role-name") {
        setIsError("Role Name is required.");
      }
    }
  };

  const toggleActive = async (checked) => {
    if (loading) return;
    setLoading(true);
    setIsActive(checked);
    setTimeout(() => {
      setLoading(false);
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
    navigate("/layout/role-list");
  }
  return (
    <div className="flex justify-start min-h-screen p-[10px]">
      <div className="w-full bg-white p-[50px] rounded-lg shadow-[0px_4px_10px_rgba(0,0,0,0.15)]">
        {/* Breadcrumb & Title */}
        <div className="mb-5">
          <Breadcrumbs />
          <div className="text-[20px] font-bold pt-2">Add New Role</div>
        </div>
        <div></div>
        <Row className="pb-[30px]">
          <Col span={8}>
            <div className="pb-[10px]">
              <Typography.Text strong className="text-[16px]">
                Role Name
              </Typography.Text>
            </div>
            <Input
              placeholder="Enter role name"
              size="large"
              value={name}
              status={isError ? "error" : ""}
              onChange={(e) => {
                setName(e.target.value);
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
                className="text-[16px]"
                checked={isActive}
                onChange={toggleActive}
                style={{
                  backgroundColor: isActive ? "#6055F2" : "#d9d9d9",
                  marginRight: "5px",
                }}
                loading={loading}
                disabled={loading}
              />
              <span>{isActive ? "Active" : "Inactive"}</span>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div className="border border-[#eee] rounded-lg">
              <div className="flex justify-between border-b border-[#eee] p-[18px_20px] bg-[#EBEAFA] text-[#6055F2] font-medium rounded-t-[10px]">
                Management Categories
              </div>
              {categories?.map((item) => {
                if (item.name === "Admin & Role Management") {
                  return (
                    <Collapse
                      key={item.id}
                      expandIcon={({ isActive }) => (
                        <RightOutlined
                          rotate={isActive ? 90 : 0}
                          className="text-[#6055F2]"
                        />
                      )}
                      expandIconPosition="end"
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
                              className={`flex justify-between p-[20px] cursor-pointer ${
                                selectedCategory?.id === item.id
                                  ? "bg-[#F5F5F5]"
                                  : "bg-white"
                              }`}
                              onClick={() => handlePermissions(child)}
                            >
                              {child.name}
                              <RightOutlined className="text-[#6055F2]" />
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
                      className={`flex justify-between p-[20px] border-b border-[#eee] cursor-pointer ${
                        selectedCategory?.id === item.id
                          ? "bg-[#F5F5F5]"
                          : "bg-white"
                      }`}
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
                  <div className="flex justify-between">
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
                className="w-full"
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

            <div className="flex justify-end mt-[10px]">
              <Button className="mt-[10px] mr-[10px]" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                className="mt-2.5 bg-[#6055F2] text-white"
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
