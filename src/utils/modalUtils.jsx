import { Modal, Input, Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import "../assets/styles/modal.css";

export const showExportModal = (password, name) => {
  setTimeout(() => {
    Modal.info({
      title: `Export ${name}`,
      content: (
        <div>
          <div
            style={{
              fontSize: "15px",
              paddingBottom: "10px",
            }}
            
          >
            Export password
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "space-between"}}>
            <Input.Password
              value={password}
              readOnly
              style={{
                borderRadius: "6px 0 0 6px",
                border: "1px solid #ccc",
                width: "380px",
  
              }}
            />
            <Button
              icon={
                <CopyOutlined
                  style={{
                    color: "white",
                    fontSize: "18px",
                  }}
                />
              }
              onClick={() => {
                navigator.clipboard.writeText(password);
              }}
              style={{
                backgroundColor: "#6055F2",
                outline: "none",
                marginLeft: "-10px",
                borderRadius: "0 6px 6px 0",
                border: "1px solid #ccc",
                height: "40px",
                width: "100px",
              }}
            ></Button>
          </div>
        </div>
      ),
      okText: "Confirm",
      okButtonProps: {
        style: {
          backgroundColor: "#6055F2",
          borderColor: "#6055F2",
          color: "white",
          position: "relative",
          borderRadius: "3px",
        },
      },
      icon: null,
      onOk() {},
    });
  }, 1000);
};
