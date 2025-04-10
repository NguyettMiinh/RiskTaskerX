import { matchRoutes } from "react-router-dom";
import routes from "../routes/routes";

export const getBreadcrumbTitle = (pathname: string) => {
  const pathParts = pathname.split("/").filter(Boolean);
  const breadcrumbPaths: string[] = [];

  pathParts.reduce((prev, curr) => {
    const currentPath = `${prev}/${curr}`;
    breadcrumbPaths.push(currentPath);
    return currentPath;
  }, "");

  const fullPaths = ["/", ...breadcrumbPaths];

  const breadcrumbs = fullPaths
    .map((path) => {
      const matches = matchRoutes(routes, path);
      if (!matches) return null;

      const match = matches[matches.length - 1]; // lấy match cuối
      const { route, params } = match;

      const title = route?.breadcrumb ?? route.path;
      return { title, path };
    })
    .filter(Boolean);

  return breadcrumbs;
};
