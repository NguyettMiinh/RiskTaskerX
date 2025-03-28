import React, { useState } from "react";
import { Select, Checkbox, Button, Space } from "antd";
import "@assets/styles/filter.css";

const { Option } = Select;

const TierSelect = ({ options, onChange, allLabel }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [tempSelectedItems, setTempSelectedItems] = useState([]);

    const handleChange = (value) => {
        setTempSelectedItems(value);
    };

    const handleCheckboxChange = (value, checked) => {
        let newSelectedItems = [...tempSelectedItems];
        if (value === "all") {
            newSelectedItems = checked ? options.map(option => option.value) : [];
        } else {
            newSelectedItems = checked
                ? [...newSelectedItems, value]
                : newSelectedItems.filter(item => item !== value);
        }
        setTempSelectedItems(newSelectedItems);
    };

    const handleOk = () => {
        setSelectedItems(tempSelectedItems);
        onChange(tempSelectedItems); 
    };

    const handleReset = () => {
        setTempSelectedItems([]);
    };

    const isAllSelected = options.length === tempSelectedItems.length;

    return (
        <Space direction="vertical">
            <Select
                mode="multiple"
                value={
                    tempSelectedItems.length === options.length
                        ? [allLabel]
                        : tempSelectedItems.length > 1
                        ? [...tempSelectedItems.slice(0, 1), `+${tempSelectedItems.length - 1}`]
                        : tempSelectedItems
                }
                onChange={handleChange}
                className="centered-select"
                style={{ width: 135, height: "40px", textAlign: "center"}}
                placeholder=""
                tagRender={({ label }) => (
                    <span>{label}</span>
                )}
                dropdownRender={(menu) => (
                    <div>
                        {options.map(option => (
                            <div key={option.value} style={{ display: "flex", alignItems: "center", padding: "8px" }}>
                                <Checkbox
                                    onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                                    checked={tempSelectedItems.includes(option.value)}
                                    className="custom-checkbox"
                                >
                                    {option.label}
                                </Checkbox>
                            </div>
                        ))}
                        <div style={{ display: "flex", alignItems: "center", padding: "8px" }}>
                            <Checkbox
                                onChange={(e) => handleCheckboxChange("all", e.target.checked)}
                                checked={isAllSelected}
                                indeterminate={tempSelectedItems.length > 0 && !isAllSelected}
                                className="custom-checkbox"
                            >
                                {allLabel}
                            </Checkbox>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px" }}>
                            <Button onClick={handleReset} className="custom-button-1">Reset</Button>
                            <Button type="primary" onClick={handleOk} className="custom-button-2">OK</Button>
                        </div>
                    </div>
                )}
            >
                {options.map(option => (
                    <Option key={option.value} value={option.value}>
                        {option.label}
                    </Option>
                ))}
            </Select>
        </Space>
    );
};

export default TierSelect;
