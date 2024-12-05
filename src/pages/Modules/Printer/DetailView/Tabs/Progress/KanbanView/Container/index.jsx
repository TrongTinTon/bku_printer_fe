import React, { forwardRef, useState } from "react";
import RenderTitle from "./RenderTitle";
import { Badge, Tooltip, Dropdown } from "antd";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import "./style.scss";
import RenderMore from "./RenderMore";

export const Container = forwardRef(
  (
    {
      data,
      items,
      children,
      disabled,
      handleProps,
      hover,
      shadow,
      style,
      onNewTask,
      heightItemActive,
      TaskInfo,
      updateColumnData,
      removeColumn,
      notification,
      ...props
    },
    ref
  ) => {
    const itemSucess = items?.filter(
      (item) => item?.cf_process * 1 === 100 && item?.cf_approve_status?.value !== "Xin duyệt"
    );

    const isCreateableTask = TaskInfo?.permission?.createable;

    const [isEditTitle, setIsEditTitle] = useState(false);

    const renderMore = () => {
      return <RenderMore data={data} notification={notification} removeColumn={removeColumn} />;
    };

    return (
      <div
        id={`kanban-container-${data?.key}`}
        {...props}
        ref={ref}
        style={{ ...style, height: heightItemActive }}
        className={`kanban-column-container ${hover && "hover"} ${shadow && "shadow"} ${disabled && "disabled"}`}
      >
        <div className={"header-container"} {...(!isEditTitle && handleProps)}>
          <div className="group-left">
            <div className="header-icon">
              <FaIcon icon="fa-regular fa-star" />
            </div>
            <div>
              <RenderTitle
                data={data}
                shadow={shadow}
                isEditTitle={isEditTitle}
                setIsEditTitle={setIsEditTitle}
                updateColumnData={updateColumnData}
              />
            </div>
          </div>
          <div className="group-right">
            <Tooltip title={`${itemSucess?.length} / ${items?.length}`} zIndex={2500}>
              <div className="header-count">
                <Badge className="header-count-badge" count={itemSucess?.length} showZero />
                <span>/</span>
                <Badge className="header-count-badge" count={items?.length} showZero />
              </div>
            </Tooltip>
            <Dropdown
              trigger={["click"]}
              dropdownRender={renderMore}
              overlayClassName="kanban-more-container"
              placement="bottom"
              arrow
              destroyPopupOnHide
            >
              <div className="btn-more">
                <FaIcon icon="fa-ellipsis" />
              </div>
            </Dropdown>
          </div>
        </div>
        <ul>{children}</ul>
        <div className="footer-container">
          {isCreateableTask ? (
            <div className="group-btn" onClick={() => onNewTask(data)}>
              <div className="btn-add-task">
                <FaIcon icon="fa-plus" />
              </div>
            </div>
          ) : (
            <div className="group-btn" />
          )}
        </div>
      </div>
    );
  }
);
