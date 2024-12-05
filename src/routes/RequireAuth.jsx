import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

function RequireAuth({ children }) {
  const user = useSelector((state) => state.account);
  const location = useLocation();
  const isLogin = localStorage?.getItem('accessToken');
  const isSignout = user.isSignout;

  const pathname = isSignout ? location.pathname : '/';
  const search = isSignout ? location.search : '';

  if (!isLogin && location.pathname !== "/login") {
    return <Navigate to="/login" state={{ path: pathname, search: search }} />;
  }

  if (isLogin && location.pathname === "/login") {
    return <Navigate to="/" />;
  }

  return children;
}

export default RequireAuth;
