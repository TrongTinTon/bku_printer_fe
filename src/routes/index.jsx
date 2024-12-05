/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import routes from "./appRoutes";
import DefaultLayout from "../layouts/DefaultLayout";
import RequireAuth from "./RequireAuth";

function Router() {
  const location = useLocation();
  const Layout = DefaultLayout;

  const routerOfPath = routes.find((item, index) => item.path === location.pathname);

  useEffect(() => {
    if (!routerOfPath?.layout) {
      document.title = `ERP | ${routerOfPath?.name || "Not Found 404"}`;
    }
  }, [routerOfPath]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route) {
        const Page = route.element;
        const layout = route.layout;
        return (
          <Route
            path={route.path}
            element={
              <RequireAuth>
                {layout === "default" ? (
                  <Layout>
                    <Page />
                  </Layout>
                ) : (
                  <Page />
                )}
              </RequireAuth>
            }
            key={route.key}
          />
        );
      }
    });

  return <Routes>{getRoutes(routes)}</Routes>;
}

export default Router;
