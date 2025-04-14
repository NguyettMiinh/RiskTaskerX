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
} from "antd";
import { useEffect, useState } from "react";
import { getPermissions, addRoles } from "@/services/roleService";
import { RightOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

function AddRole() {
  const [categories, setCategories] = useState([]);
  const [value, setValue] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [isError, setIsError] = useState("");
  const [name, setName] = useState();
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

  function handleCheckBox(value, checked) {
    if (checked) {
      setValue((prev) => [...prev, value]);
    } else {
      setValue((prev) => prev.filter((item) => item !== value));
    }
  }


  // Khi chọn category mới:
  const handlePermissions = (category) => {
    setSelectedCategory(category);
    setPermissions(category.children);
  };



  const handleAdd = async () => {
    try {
      const response = await addRoles(name, isActive, value);
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
    if (checked) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
// const navigate = useNavigate();
//   const handleBreadcrumbNavigate = (item) => {
//     Modal.confirm({
//       title: "Are you sure you want to save your changes?",
//       okText: "Yes",
//       cancelText: "Cancel",
//       onOk() {
//         navigate(item.path);
//       },
//     });
//   };
/*
  - kiem tra xem mang chua cac permission duoc chon co chua moi phan tu cua tung categories ko? 
*/

const checkAll =  selectedCategory?.children.map((item) => item.id).every(item => value.includes(item));
function handleAll(e) {
  if (e) {
    const all = permissions.map((option) => option.id);
    setValue((prev) => [...prev,...all]);
  } else {
    setValue([]);
  }
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
        <Breadcrumbs  />
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
                  value={name}
                  status={isError ? "error" : ""}
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameError(""); 
                  }}
                />
                {isError && <div style={{ color: "red" }}>{isError}</div>}
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
                        {" "}
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
                    checked={isActive}
                    onChange={(checked) => toggleActive(checked)}
                    style={{
                      backgroundColor: isActive ? "#6055F2" : "#d9d9d9",
                      marginRight: "5px",
                    }}
                    loading={isLoading}
                    disabled={isLoading}
                  />{" "}
                  <span>{isActive ? "Active" : "Inactive"}</span>
                </div>
              </div>
              <div
                style={{
                  paddingTop: "30px",
                }}
              >
                <Card
                 title= {
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}>
                      <div>Permissions</div>
                      <div>
                        <Checkbox
                          checked={checkAll}
                          onChange={(e) => handleAll(e.target.checked)}
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
                        <div key={child.id} style={{
                          paddingBottom: "10px",
                        }}>
                          <Checkbox
                            onChange={(e) =>
                              handleCheckBox(child.id, e.target.checked)
                            }
                            checked={value.includes(child.id)}
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
                    backgroundColor: "#6055F2",
                    color: "white",
                  }}
                  onClick={handleAdd}
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

export default AddRole;
