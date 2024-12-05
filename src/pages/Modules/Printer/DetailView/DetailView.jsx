/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Modal, ConfigProvider } from "antd";
import RenderModal from "src/pages/Modules/Apps/DetailView/RenderModal";
import RenderTabProgress from "./Tabs/Progress/RenderTabProgress";
import appGlobal from "src/global/AppGlobal";
import "./style.scss";

function DetailView(props) {
  const { module, handleSetUrl } = props;

  const url = new URL(window.location);
  const location = useLocation();
  const searchParams = new URLSearchParams(url.search);
  const recordId = searchParams.get("record");
  const ProjectTaskInfo = appGlobal.GetModuleInfo("ProjectTask");
  const TaskInfo = appGlobal.GetModuleInfo("Task");

  const [open, setOpen] = useState(false);

  const tabsList = [
    {
      label: "Tiến độ công việc",
      icon: "fa-bars-progress",
      content: RenderTabProgress,
      props: {
        ProjectTaskInfo: ProjectTaskInfo,
        TaskInfo: TaskInfo,
      },
    },
    { label: "Tài liệu", icon: "fa-paperclip" },
    { label: "Báo cáo", icon: "fa-chart-pie" },
  ];

  useEffect(() => {
    recordId ? showDrawer() : setOpen(false);
  }, [location]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = async () => {
    if (recordId) {
      const saveBtn = document.getElementById("btnSaveProject");
      await saveBtn?.click();
    }

    handleSetUrl(null, null, null);
    setOpen(false);

    const kanbanContent = document.querySelector(".kanban-container");
    kanbanContent && kanbanContent?.remove();
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          motionDurationSlow: "0.2s",
          motionDurationMid: "0.2s",
        },
      }}>
      <div id="btnOpenProjectDetail" onClick={showDrawer} />
      <Modal
        className="detail-modal-app detail-modal-project"
        open={open}
        centered={true}
        destroyOnClose={true}
        onCancel={onClose}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        closeIcon={false}
        transitionName="ant-slide-up">
        {open && (
          <RenderModal
            module={module}
            recordId={recordId}
            onCloseModal={onClose}
            tabsList={tabsList}
            placementTab={"in-header"}
          />
        )}
      </Modal>
    </ConfigProvider>
  );
}

export default DetailView;
