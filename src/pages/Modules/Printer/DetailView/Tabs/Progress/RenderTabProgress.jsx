import React, { useState, memo } from "react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { KanbanBoard } from "./KanbanView/KanbanBoard";
import SegmentedCustom from "src/components/Segmented";
import appGlobal from "src/global/AppGlobal";

const RenderTabProgress = memo((props) => {
  const { module } = props;
  const userInfo = appGlobal.GetUserInfo();
  const configDetailView = JSON.parse(localStorage.getItem("configDetailView")) || {};

  const [viewProgress, setViewProgress] = useState(configDetailView?.[module?.name]?.viewProgress || "kanban"); // kanban, list, calendar, timeline

  const listView = [
    {
      label: "Bảng",
      value: "kanban",
      icon: <FaIcon icon="fa-table-columns" />,
    },
    {
      label: "Danh sách",
      value: "list",
      icon: <FaIcon icon="fa-list-ul" />,
    },
    {
      label: "Lịch",
      value: "calendar",
      icon: <FaIcon icon="fa-regular fa-calendar" />,
    },
    {
      label: "Timeline",
      value: "timeline",
      icon: <FaIcon icon="fa-timeline" />,
    },
  ];

  const onChangeView = (value) => {
    setViewProgress(value);
    const config = { viewProgress: value };
    appGlobal.onSaveConfigDetailView("Project", config);
  };

  const renderTabs = () => {
    return <SegmentedCustom options={listView} onChange={onChangeView} defaultValue={viewProgress} />;
  };

  switch (viewProgress) {
    case "kanban":
      return <KanbanBoard {...props} userInfo={userInfo} renderTabs={renderTabs} />;
    default:
      return <div className="default-progress-view">{renderTabs()}</div>;
  }
});

export default RenderTabProgress;
