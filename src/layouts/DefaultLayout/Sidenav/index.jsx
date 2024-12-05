/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { Layout, Menu } from "antd";
import DividerCustom from "../../../components/Divider";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Menus from "./ListItemMenu";
import appGlobal from "../../../global/AppGlobal";
import ServerUrl from "../../../constants/ServerUrl";
import "./styles.scss";

const { Sider } = Layout;
const rootSubmenuKeys = ["sub1", "sub2", "sub3", "sub4"];

const Sidenav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const moduleUrl = searchParams.get("module");

  const sidenavClose = useSelector((state) => state.account.sidenavClose);
  const moduleLists = useSelector((state) => state.module.moduleLists);

  const isCloseSidenav = sidenavClose;

  const itemsMenus = Menus.renderItemMenu(moduleLists);

  const subOpenKey = !isCloseSidenav
    ? itemsMenus
        .map((group) =>
          group.children?.find((item) =>
            item.children?.find((subItem) => appGlobal.getModuleFromString(subItem.key) === moduleUrl)
          )
        )
        .find((key) => key)
    : { key: "/" };

  const [openKeys, setOpenKeys] = useState([subOpenKey?.key]);
  const [keySelected, setKeySelected] = useState([
    moduleUrl ? `${location.pathname}?module=${moduleUrl}` : location.pathname,
  ]);

  // Chọn lại item khi chuyển route
  useEffect(() => {
    const moduleUrl = searchParams.get("module");
    setKeySelected([moduleUrl ? `${location.pathname}?module=${moduleUrl}` : location.pathname]);
    setOpenKeys([subOpenKey?.key] || ["/"]);
  }, [location]);

  // Mở lại submenu đang có item được chọn
  useEffect(() => {
    if (!isCloseSidenav) {
      setTimeout(() => {
        setOpenKeys([subOpenKey?.key] || ["/"]);
      }, 10);
    }
  }, [isCloseSidenav]);

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const onSelectItem = ({ key }) => {
    navigate(key);
    setKeySelected([key]);
  };

  return (
    <Sider
      className="sidernav"
      width="250"
      collapsedWidth="96"
      theme="light"
      trigger={null}
      collapsible
      collapsed={isCloseSidenav}>
      <div className="sidernav_logo">
        <img
          className="sidernav_logo_img"
          src={`${ServerUrl.urlSub}assets/images/Logo.png`}
          alt="ERP LOGO"
          onClick={() => onSelectItem({ key: "/" })}
        />
        <span className="sidernav_logo_name">ERP QUOC DUY</span>
      </div>

      <DividerCustom className="divider" />

      <Menu
        className="sidernav_menu"
        mode="inline"
        triggerSubMenuAction="click"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        items={itemsMenus}
        onSelect={onSelectItem}
        selectedKeys={keySelected}
      />
    </Sider>
  );
};

export default Sidenav;
