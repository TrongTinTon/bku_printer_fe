import HomePage from "../pages/Home";
import NotFound404 from "../pages/NotFound404";
import Profile from "../pages/User/Profile";
import Login from "../pages/User/Login";
import ListView from "../pages/Modules/Printer/ListView/ListView";

const routes = [
  {
    name: "Đăng nhập",
    key: "login",
    path: "/login",
    element: Login,
    layout: null,
  },

  {
    name: "Trang chủ",
    key: "home",
    path: "/",
    element: HomePage,
    layout: "default",
  },

  {
    name: "Danh sách",
    key: "list",
    path: "/printer",
    element: ListView,
    layout: "default",
  },

  {
    name: "Hồ sơ",
    key: "profile",
    path: "/profile",
    element: Profile,
    layout: "default",
  },

  {
    name: "Not Found 404",
    key: "404",
    path: "/*",
    element: NotFound404,
    layout: null,
  },
];

export default routes;
