import React from "react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import "./style.scss";

function WGBoxItem(props) {
  const {
    icon,
    colorStyle,
    avatarUrl,
    label,
    status,
    subLabel,
    iconSubLabel,
    createTime,
    onPressInfo,
    onConfirm,
    onCancel,
  } = props;
  return (
    <div className="item-container">
      <div className="item-container_info">
        <div className="avatar-container">
          <div className={`avatar ${colorStyle}-gradient-bg`}>
            <img src={avatarUrl} className="avatar-image" />
            {icon && (
              <div className="avatar-icon">
                <img src={icon} height={"12px"} />
              </div>
            )}
          </div>
        </div>
        <div className="content-container">
          <div className="group-content">
            <span className="label">{label}</span>
            <div className={`status ${colorStyle}-gradient-bg`}>
              <span className="status_text">{status}</span>
            </div>
          </div>
          <div className="group-sub-content">
            <div className="sub-label">
              {iconSubLabel && <span className="sub-label_icon">{iconSubLabel}</span>}
              <span className="sub-label_text">{subLabel}</span>
            </div>
            {createTime && (
              <div className="sub-time">
                <FaIcon icon="fa-regular fa-clock" />
                <span>{createTime}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {onPressInfo && (
        <div className="item-container_action">
          <div className={`btn-action ${colorStyle}-secondary-bg`}>
            <span className={colorStyle}>Xem</span>
          </div>
        </div>
      )}

      {(onConfirm || onCancel) && (
        <div className="item-container_action">
          {onCancel && (
            <div className={`btn-confirm disable-secondary-bg`}>
              <span className={"disable"}>
                <FaIcon icon="fa-xmark" />
              </span>
            </div>
          )}
          {onConfirm && (
            <div className={`btn-confirm success-secondary-bg`}>
              <span className={colorStyle}>
                <FaIcon icon="fa-check" />
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default WGBoxItem;
