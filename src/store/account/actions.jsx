import { post } from "../method";
import { Cookies } from "react-cookie";
import { loginSuccess, logOut, setUserInfo, setSidenav, clearStore } from "./reducers";
import { clearStoreModule } from "../module/reducers";

export const login = (email, password) => {
  return async (dispatch, getState) => {
    const resLogin = await post("login", { email: email, password: password }, dispatch);
    const { status, data, message } = resLogin;
    if (status == "success") {
      const { token, user } = data;
      localStorage.setItem('accessToken', token);
      dispatch(
        loginSuccess({
          userId: user?.id,
          email: user?.email,
          username: user?.userName,
          roleId: user?.roleId,
          roleName: user?.roleName,
          isSignout: false,
        })
      );
      return resLogin;
    }

    return resLogin;
  };
};

export const logout = (isSignout) => {
  return async (dispatch) => {
    await localStorage.clear();

    dispatch(logOut());

    if (isSignout) {
      dispatch(clearStore());
      dispatch(clearStoreModule());
    }
  };
};
