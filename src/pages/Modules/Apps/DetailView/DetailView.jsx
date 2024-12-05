/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Modal, ConfigProvider } from "antd";
import RenderModal from "./RenderModal";
import "./style.scss";

function DetailView(props) {
  const { module, handleSetUrl } = props;

  const url = new URL(window.location);
  const location = useLocation();
  const searchParams = new URLSearchParams(url.search);
  const recordId = searchParams.get("record");

  const [open, setOpen] = useState(false);

  useEffect(() => {
    recordId ? showDrawer() : setOpen(false);
  }, [location]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = async () => {
    handleSetUrl(null, null, null);
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
      <div id="btnOpenDetailRecord" onClick={showDrawer} />
      <Modal
        className="detail-modal-app"
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

export default DetailView;
