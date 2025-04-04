import { Modal, Input, Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";

export const showExportModal = (password) => {
  setTimeout(() => {
    Modal.info({
      title: "Export Customer List",
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
          <div style={{ display: "flex", gap: "10px" }}>
            <Input.Password
              value={password}
              readOnly
              style={{
                width: "300px",
                borderRadius: "6px 0 0 6px",
                border: "1px solid #ccc",
                height: "40px",
                fontWeight: 400,
              }}
            />
            <Button
              icon={
                <CopyOutlined
                  style={{
                    color: "white",
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
                width: "50px",
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
        },
      },
      icon: null,
      onOk() {},
    });
  }, 1000);
};
