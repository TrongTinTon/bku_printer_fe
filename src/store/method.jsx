import { Cookies } from "react-cookie";
import { logout } from "./account/actions";
import Server from "../constants/ServerUrl";
import configApp from "../configApp";

export const post = async (operation, body, dispatch) => {
  const cookies = new Cookies();
  const ERP_PHPSESSID = cookies.get("ERP_PHPSESSID");
  const PRODUCTION = configApp.production;
  const VERSION = configApp.version;
  const serverUrl = PRODUCTION ? Server.value : Server.valueTest;

  const formData = {
    _session: ERP_PHPSESSID,
    ...body,
  };

  let headerInput = {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
  };

  const requestOptions = {
    method: "POST",
    cache: "no-cache",
    headers: { ...headerInput },
    body: JSON.stringify(formData),
  };

  const url = `${serverUrl}/${operation}?v=${VERSION}`;

  const response = await fetch(url, requestOptions);

  const resData = await response.json();

  if (
    (resData && resData.status == "error" && resData.message === "Email không đúng") ||
    (!localStorage.getItem('accessToken') && operation !== "login")
  ) {
    dispatch(logout(false));
    return;
  }
  console.log(resData)
  return resData;
};


export const uploadFilePost = async (operation, formData, dispatch) => {
  const PRODUCTION = configApp.production;
  const VERSION = configApp.version;
  const serverUrl = PRODUCTION ? Server.value : Server.valueTest;

  // URL endpoint API
  const url = `${serverUrl}/${operation}?v=${VERSION}`;

  // Cấu hình request
  const requestOptions = {
    method: "POST",
    headers: {
      // Không cần đặt Content-Type, FormData sẽ tự động xử lý
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: formData, // FormData sẽ tự động thiết lập Content-Type: multipart/form-data
  };

  try {
    const response = await fetch(url, requestOptions);

    // Kiểm tra lỗi HTTP
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Chuyển đổi phản hồi JSON
    const resData = await response.json();

    // Kiểm tra phản hồi từ server
    if (
      (resData && resData.status === "error" && resData.message === "Email không đúng") ||
      (!localStorage.getItem("accessToken") && operation !== "login")
    ) {
      dispatch(logout(false));
      return null;
    }

    console.log("Response Data:", resData);
    return resData;
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

