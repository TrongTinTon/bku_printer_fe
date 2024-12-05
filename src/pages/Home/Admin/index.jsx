/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useState } from "react";
import { useSelector } from "react-redux";
import { Row, Col } from "antd";
import "./style.scss";

function AdminHomePage() {
  const accountStore = useSelector((state) => state.account);
  const { username } = accountStore;
  return (
    <div className="admin-container">
      <Row className="container" gutter={[16, 16]} align="">
        <Col
          className="leftsidebar"

          xs={{
            span: 24
          }}

          sm={{
            span: 24
          }}

          lg={{
            span: 24
          }}
        >
          <h1>Xin chào {username} !</h1>
        </Col>
      </Row >
    </div>
  );
}

export default memo(AdminHomePage);
