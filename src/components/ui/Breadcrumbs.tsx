import { Breadcrumb } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { getBreadcrumbTitle } from "../../utils/getBreadcrumbTitle";

function Breadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate();
  const breadcrumbItems = getBreadcrumbTitle(location.pathname);
  
  return (
    <Breadcrumb
      style={{ fontSize: "21px", paddingBottom: "8px" }}
      items={breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        return {
          title: (
            <span
              style={{
                fontSize: "20px",
                color: isLast ? "#1677FF" : undefined,
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
