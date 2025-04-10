import React, { useState } from "react";
import { Checkbox, Select, Button } from "antd";
import "@assets/styles/filter.css";
const SelectComponent = ({ options, allLabel, onChange }) => {
  // tra ve mang cac option value
  const [value, setValue] = useState(options.map((option) => option.value));
  const indeterminate = value.length > 0 && value.length < options.length;
  const checkAll = options.length === value.length;

  // xóa dấu x ở tag
  function tagRender(props) {
    const { label } = props;
    return <div closable="false">{label}</div>;
  }
  // khi nhấn vào checkbox thì sẽ thêm hoặc xóa giá trị của checkbox đó vào mảng value
  function handleCheckBox(value, checked) {
    if (checked) {
      setValue((prev) => [...prev, value]);
    } else {
      setValue((prev) => prev.filter((item) => item !== value));
    }
  }
  // khi nhấn vào checkbox all thì sẽ chọn tất cả các checkbox khác
  // nếu đã chọn hết thì bỏ chọn tất cả
  const onCheckAllChange = (e) => {
    const checked = e.target.checked;
    if (checked) {
      setValue(options.map((option) => option.value));
    } else {
      setValue([]);
    }
  };
  // khi nhấn reset thì xóa hết các checkbox đã chọn
  function handleReset() {
    setValue([]);
  }
  // khi nhan btn OK
  function handleOk() {
    onChange(value);
  }
  // custom lại dropdown của select
  function dropdownRender() {
    return (
      <div>
        {options.map((option) => {
          return (
            <div
              key={option.value}
              style={{ display: "flex", alignItems: "center", padding: "8px" }}
            >
              <Checkbox
                onChange={(e) => handleCheckBox(option.value, e.target.checked)}
                checked={value.includes(option.value)}
                className="custom-checkbox"
              >
                {option.label}
              </Checkbox>
            </div>
          );
        })}
        <div style={{ display: "flex", alignItems: "center", padding: "8px" }}>
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
            className="custom-checkbox"
          >
            {allLabel}
          </Checkbox>
        </div>

        <div style={{ display: "flex", padding: "8px" }}>
          <Button onClick={handleReset} className="btn-1">
            Reset
          </Button>
          <Button onClick={handleOk} className="btn-2">
            OK
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Select
        mode="multiple"
        style={{
          width: "135px",
        }}
        size="large"
        value={value.length === options.length ? [allLabel] : value}
        options={options}
        maxTagCount={1}
        maxTagPlaceholder={(omittedValues) => `+ ${omittedValues.length}`}
        tagRender={tagRender}
        dropdownRender={dropdownRender}
        popupMatchSelectWidth={false}
      />
    </div>
  );
};

export default SelectComponent;

//  onChang(value) = filterHandle(value)
