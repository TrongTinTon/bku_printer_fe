/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Layout } from "antd";

import HeaderComponent from "./Header";
import { fetchModules } from "../../store/module/actions";

const { Content } = Layout;

function DefaultLayout({ children, socket }) {
  const dispatch = useDispatch();

  useEffect(() => {
    window.addEventListener("load", handleReloadLoad);
    return () => {
      window.removeEventListener("load", handleReloadLoad);
    };
  }, []);

  const handleReloadLoad = () => {
    dispatch(fetchModules());
  };

  return (
    <Layout>
      <Layout>
        <HeaderComponent />
        <Content className="default-layout-content">{children}</Content>
      </Layout>
    </Layout>
  );
}

export default DefaultLayout;
