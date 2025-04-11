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
import { useEffect, useState } from "react";
import { getPermissions } from "@/services/roleService";
import { RightOutlined } from "@ant-design/icons";

function DetailRole() {
  const [categories, setCategories] = useState([]);
  const [value, setValue] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const indeterminate = value.length > 0 && value.length < permissions.length;
  const checkAll = permissions.length === value.length;
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await getPermissions();
        // Xử lý dữ liệu response ở đây nếu cần
        setCategories(response.data.results);
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
      }
    };

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
  setPermissions(category.children || []);
  setValue([]); // reset checkbox khi chọn danh mục khác
};

// Check all
const onCheckAllChange = (e) => {
  const checked = e.target.checked;
  if (checked) {
    setValue(permissions.map((option) => option.id));
  } else {
    setValue([]);
  }
};

console.log(value);

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
            Role Detail
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
                <Input placeholder="Enter role name" size="large" />
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
                  <Switch /> <span>Active</span>
                </div>
              </div>
              <div
                style={{
                  paddingTop: "30px",
                }}
              >
                <Card
                  title="Permission"
                  styles={{ header: { background: "#EBEAFA" } }}
                  style={{ width: "100%" }}
                >
                  {selectedCategory?.children?.length > 0 ? (
                    <>
                      {selectedCategory.children.map((child) => (
                        <div key={child.id}>
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
                      <Checkbox
                        indeterminate={indeterminate}
                        onChange={onCheckAllChange}
                        checked={checkAll}
                        className="custom-checkbox"
                      >
                        All
                      </Checkbox>
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
