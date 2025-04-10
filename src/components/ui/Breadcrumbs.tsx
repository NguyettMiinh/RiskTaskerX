import { Breadcrumb } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { getBreadcrumbTitle } from "../../utils/getBreadcrumbTitle";
import React from 'react'

function Breadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate();
  const breadcrumbItems = getBreadcrumbTitle(location.pathname);
  const items = [
    {
      onClick: () => navigate("/"),
    },
    ...breadcrumbItems.map((item, index) => {
      const isLast = index === breadcrumbItems.length - 1;
      return {
        title: (
          <span
            style={{
              fontWeight: isLast ? "bold" : "normal",
              color: isLast ? "#1890ff" : undefined, // màu xanh highlight
            }}
          >
            {item?.title}
          </span>
        ),
        onClick: () => {
          if (!isLast) navigate(item?.path ?? '');
        },
      };
    }),
  ];

  return (
    <Breadcrumb
      style={{ fontSize: "21px", paddingBottom: "8px" }}
      items={breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        return {
          title: (
            <span
              style={{
                fontWeight: isLast ? "bold" : "normal",
                color: isLast ? "#1677ff" : undefined,
              }}
            >
              {item?.title}
            </span>
          ),
          onClick: () => {
            if (!isLast) navigate(item?.path ?? '');
          },
        };
      })}
    />
  );
}

export default Breadcrumbs
