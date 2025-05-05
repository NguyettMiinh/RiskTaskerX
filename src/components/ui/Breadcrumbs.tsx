import { Breadcrumb } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { getBreadcrumbTitle } from "../../utils/getBreadcrumbTitle";

function Breadcrumbs({ onBeforeNavigate } : any) {
  const location = useLocation();
  const navigate = useNavigate();
  const breadcrumbItems = getBreadcrumbTitle(location.pathname);
  
  return (
    <Breadcrumb
      className="pb-[10px]"
      items={breadcrumbItems.map((item, index: number) => {
        const isLast = index === breadcrumbItems.length - 1;
        return {
          title: (
            <span
            className={`
              text-[15px]
              ${isLast ? 'text-blue-600 cursor-default underline' : 'cursor-pointer'}
            `}
            >
              {item?.title}
            </span>
          ),
          onClick: () => {
            if (!isLast) {
              if (onBeforeNavigate) {
                onBeforeNavigate(item); 
              } else {
                navigate(item?.path || "");
              }
            }
          },
        };
      })}
    />
  );
}

export default Breadcrumbs;
