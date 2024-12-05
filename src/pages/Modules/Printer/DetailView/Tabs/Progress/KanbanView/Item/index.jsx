import React, { useEffect } from "react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import "./style.scss";

export const Item = React.memo(
  React.forwardRef(
    (
      { dragOverlay, dragging, disabled, fadeIn, listeners, transition, transform, data, onClick, styleVir, ...props },
      ref
    ) => {
      // Field value
      const taskStatus = data?.cf_task_status?.value;
      const statusColor = data?.cf_task_status?.picklistColor;
      const important = data?.cf_important || [];
      const isImportant = important.some((val) => val.value === "Quan trọng");
      const isUrgent = important.some((val) => val.value === "Khẩn cấp");
      const process = data?.cf_process * 1 || 0;
      const label = data?.label || "";
      const description = data?.description || "";
      const deadline = data?.cf_deadline_date;
      const owner = data?.smownerid;
      const ownerImg = owner?.imgUrl || "layouts/v7/skins/images/defautAvatar.png";
      const approveStatus = data?.cf_approve_status?.value;
      const isFinished = process === 100 && approveStatus !== "Xin duyệt";
      const approveLabel =
        approveStatus === "Đồng ý" ? "Đã duyệt" : approveStatus === "Từ chối" ? "Không duyệt" : "Chờ duyệt";
      const classApprove = approveStatus === "Đồng ý" ? "approve" : approveStatus === "Từ chối" ? "reject" : "waiting";
      const childrens = data?.childrens;
      const childrenSuccess = childrens?.records?.filter(
        (item) => item?.cf_process * 1 === 100 && item?.cf_approve_status?.value !== "Xin duyệt"
      );
      const checkLists = data?.checklists || [];
      const checkListsSuccess = checkLists?.filter((item) => item?.ischecked === "1");

      const onClickItem = (e) => {
        if (e.button === 2) return;
        onClick && onClick(data.key);
      };

      return (
        <li
          id={`kanban-item-${data.key}`}
          className={`kanban-item-wrapper ${fadeIn && "fadeIn"} ${dragOverlay && "dragOverlay"}`}
          style={{
            transition: [transition].filter(Boolean).join(", "),
            "--translate-x": transform ? `${Math.round(transform.x)}px` : undefined,
            "--translate-y": transform ? `${Math.round(transform.y)}px` : undefined,
            "--scale-x": transform?.scaleX ? `${transform.scaleX}` : undefined,
            "--scale-y": transform?.scaleY ? `${transform.scaleY}` : undefined,
            ...styleVir,
          }}
          ref={ref}>
          <div
            className={`kanban-item ${dragging && "dragging"} ${dragOverlay && "dragOverlay"} 
            ${disabled && "disabled"} ${isFinished && "finished"}`}
            data-cypress="draggable-item"
            {...listeners}
            {...props}
            tabIndex={0}
            onMouseUp={onClickItem}>
            <div className="group-title">
              <div className="group-status">
                {isFinished && (
                  <span title={"Hoàn thành"}>
                    <FaIcon icon="fa-regular fa-circle-check" color="#54CB33" fontSize={16} />
                  </span>
                )}
                {approveStatus && (
                  <div title={approveLabel}>
                    <div className={`approve-bage ${classApprove}`} />
                    <div className={`approve-group ${classApprove}`}>
                      <FaIcon icon="fa-question" />
                    </div>
                  </div>
                )}
                <div
                  className="status"
                  style={{ background: `linear-gradient(310deg, ${statusColor?.color2}, ${statusColor?.color})` }}>
                  <span>{taskStatus}</span>
                </div>
              </div>

              <div className="important-percent">
                {isUrgent && (
                  <div title={"Khẩn cấp"}>
                    <FaIcon icon="fa-bolt-lightning" color="#F63A46" />
                  </div>
                )}
                {isImportant && (
                  <div title={"Quan trọng"}>
                    <FaIcon icon="fa-flag" color="#F87738" />
                  </div>
                )}
                <span className="percent">{process}%</span>
              </div>
            </div>

            <div className="label">{label}</div>
            {description && <div className="description">Mô tả: {description || "--"}</div>}

            {/* {description && (
              <div className="image">
                <img src={`https://quocduygroup.com/vtiger/${data.smownerid?.imgUrl}`} />
              </div>
            )} */}

            <div className="group-deadline-owner">
              <div className={`deadline ${taskStatus == "Quá hạn" ? "over" : ""}`} title={"Hạn hoàn thành"}>
                <span className="icon">
                  <FaIcon icon="fa-regular fa-calendar" />
                </span>
                <span>{deadline ? dayjs(deadline).format("DD-MM-YYYY") : "Chưa có ngày"}</span>
              </div>
              <span className="line">|</span>
              <div className="owner">
                <img src={`https://quocduygroup.com/vtiger/${ownerImg}`} />
                <span>{owner?.label}</span>
              </div>
            </div>

            <div className="group-info">
              <div className="item-info">
                <div className={`group-val ${checkLists?.length === 0 && "disabled"}`} title="Checklist">
                  <FaIcon icon="fa-regular fa-circle-check" color="#A0AEC0" />
                  <span>
                    {checkListsSuccess?.length || 0}/{checkLists?.length || 0}
                  </span>
                </div>

                <div className={`group-val ${childrens?.records?.length === 0 && "disabled"}`} title="Công việc con">
                  <FaIcon icon="fa-folder-tree" color="#A0AEC0" />
                  <span>
                    {childrenSuccess?.length || 0}/{childrens?.records?.length}
                  </span>
                </div>

                <div className="group-val disabled" title="Bình luận">
                  <FaIcon icon="fa-regular fa-comments" color="#A0AEC0" />
                  <span>0</span>
                </div>

                <div className="group-val disabled" title="Tài liệu">
                  <FaIcon icon="fa-paperclip" color="#A0AEC0" />
                  <span>0</span>
                </div>
              </div>
            </div>
          </div>
        </li>
      );
    }
  )
);
