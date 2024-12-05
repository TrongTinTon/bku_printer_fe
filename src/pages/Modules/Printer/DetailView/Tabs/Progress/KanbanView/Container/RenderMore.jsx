import React from "react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";

function RenderMore({ data, notification, removeColumn }) {
  const isDeletable = data?.isDeletable;
  const handleRemoveColumn = async () => {
    closeDropdown();

    const config = (
      <div>
        <Button type="link" onClick={() => notification.destroy()}>
          Hủy
        </Button>
        <Button
          type="primary"
          className="btn-remove"
          onClick={() => {
            removeColumn(data?.key);
            notification.destroy();
          }}>
          Xóa
        </Button>
      </div>
    );
    notification.error({
      key: "remove-column",
      message: "Cảnh báo!",
      description: (
        <span>
          Tất cả công việc thuộc <b>{data?.label}</b> sẽ bị xóa. Bạn có chắc chắn muốn xóa cột này?
        </span>
      ),
      btn: config,
      duration: 0,
      placement: "top",
      closeIcon: <FaIcon icon="fa-xmark" />,
      icon: <FaIcon icon="fa-regular fa-trash-can" color="#F63A46" />,
      className: "notification-custom remove-popup",
    });
  };

  const closeDropdown = () => {
    const btnMore = document.querySelector(".btn-more");
    btnMore?.click();
  };

  return (
    <div className="more-container">
      {isDeletable && (
        <div className="more-item remove" onClick={handleRemoveColumn}>
          <FaIcon icon="fa-regular fa-trash-can" />
          <span>Xóa</span>
        </div>
      )}
      <div className="more-item">
        <FaIcon icon="fa-ellipsis" />
        <span>Thêm</span>
      </div>
    </div>
  );
}

export default RenderMore;
