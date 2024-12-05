/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../../store/account/actions";
import { App as AntdApp, Button, Avatar, Badge, Dropdown } from "antd";
import ServerUrl from "../../../constants/ServerUrl";

import PopupUserInfo from "src/layouts/DefaultLayout/Header/PopupUserInfo.jsx";
import { NavLink } from "react-router-dom";

import "./style.scss";



const Header = ({ socket }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Kiểm tra đường dẫn hiện tại có phải đường dẫn active không
  const isActive = (path) => location.pathname === path;
  console.log(location.pathname)
  const dispatch = useDispatch();
  const [menuItems, setMenuItems] = useState([
    { label: "Trang in", path: "/" },
  ]);
  const userInfo = useSelector((state) => state.account);

  let imgUrl = `${ServerUrl.urlSub}assets/images/defautAvatar.png`;
  let logo = `${ServerUrl.urlSub}assets/images/bku_logo.svg`;

  const onPressLogout = async () => {
    const isSignout = true;
    await dispatch(logout(isSignout));
  };

  const renderUserInfo = <PopupUserInfo userInfo={userInfo} onPressLogout={onPressLogout} imgUrl={imgUrl} />;

  useEffect(() => {
    if (userInfo && userInfo?.roleId == 2) {
      setMenuItems([
        { label: "Dashboard", path: "/" },
        { label: "Quản lý máy in", path: "/printer" },
      ])
    }
  }, [userInfo]);

  return (
    <div className="header">
      <div>
        <div className="logo">
          <img className="logo_src" src={logo} />
          <div className="logo_appInfo">
            <p className="logo_appInfo_title">Hệ thống in thông minh</p>
            <p className="logo_appInfo_subTitle" >Dịch vụ tiện ích</p>
          </div >
        </div>
      </div>

      <nav>
        <ul className="menu">
          {menuItems.map((item, index) => (
            <li
              key={index}
              onClick={() => navigate(item.path)}
              className={isActive(item.path) ? "active" : ""}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </nav>
      <div className="info">
        {/* Popup UserInfo */}
        <Dropdown
          dropdownRender={() => {
            return renderUserInfo;
          }}
          trigger={["click"]}
          overlayClassName="popupUserInfo"
        >
          <Avatar src={<img src={imgUrl} alt="avatar" />} />
        </Dropdown>

      </div>

    </div >
  );
};

export default memo(Header);
