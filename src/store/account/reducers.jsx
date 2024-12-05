import { createSlice } from "@reduxjs/toolkit";
import { isEqual } from "lodash";

const initialState = {
  userId: null,
  email: null,
  username: null,
  roleId: null,
  roleName: null
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    logOut: (state) => {
      state.isSignout = true;
      state.userId = null;
      state.email = null;
      state.userId = null;
      state.userName = null;
    },
    loginSuccess: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearStore: () => initialState,
  },
});

export const { logOut, loginSuccess, setUserInfo, setSidenav, clearStore } = accountSlice.actions;

export default accountSlice.reducer;
