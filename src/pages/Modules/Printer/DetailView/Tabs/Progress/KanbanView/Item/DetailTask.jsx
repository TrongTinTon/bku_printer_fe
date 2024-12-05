/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Drawer, ConfigProvider } from "antd";
import RenderTaskDetailModel from "src/pages/Modules/Task/DetailView/RenderModal";
import "src/pages/Modules/Task/DetailView/style.scss";

function DetailTask(props) {
  const { module, recordId, openTaskDetail, onCloseTaskDetail, fetchItems, dataProjectKanban, fieldsTaskChange } =
    props;

  const onReloadList = () => {
    fetchItems({ column: null });
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          motionDurationSlow: "0.2s",
          motionDurationMid: "0.2s",
        },
      }}
    >
      <Drawer
        className="detail-modal-task"
        placement="right"
        width={700}
        zIndex={2000}
        onClose={onCloseTaskDetail}
        open={openTaskDetail}
        closeIcon={false}
        destroyOnClose={true}
        maskClosable={true}
      >
        {openTaskDetail && (
          <RenderTaskDetailModel
            recordId={recordId}
            module={module}
            onClose={onCloseTaskDetail}
            onReloadList={onReloadList}
            dataProjectKanban={dataProjectKanban}
            fieldsChange={fieldsTaskChange}
          />
        )}
      </Drawer>
    </ConfigProvider>
  );
}

export default DetailTask;
