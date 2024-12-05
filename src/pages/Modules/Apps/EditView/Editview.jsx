/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Modal, ConfigProvider } from "antd";
import RenderModal from "./RenderModal";
import "./style.scss";

function EditView(props) {
  const { module } = props;

  const url = new URL(window.location);
  const searchParams = new URLSearchParams(url.search);
  const recordId = searchParams.get("record");

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = async () => {
    setOpen(false);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          motionDurationSlow: "0.2s",
          motionDurationMid: "0.2s",
        },
      }}>
      <div id="btnOpenEditRecord" onClick={showDrawer} />
      <Modal
        className={`edit-modal-app ${recordId ? "no-mask" : ""}`}
        open={open}
        centered={true}
        destroyOnClose={true}
        onCancel={onClose}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        closeIcon={false}
        transitionName="ant-slide-up">
        {open && <RenderModal module={module} recordId={recordId} onCloseModal={onClose} />}
      </Modal>
    </ConfigProvider>
  );
}

export default EditView;
