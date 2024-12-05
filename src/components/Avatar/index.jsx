import React from "react";
import { Tooltip } from "antd";
import "./style.scss";

function Avatar({ listUsers, maxCount = 1, size = 38, moreStyle }) {
  const renderMoreUser = () => {
    return listUsers?.map((item, index) => {
      const permistion = item?.permission === "read" ? "Đọc" : "Ghi";
      return (
        index >= maxCount && (
          <div key={`more-${index}`}>
            {item?.label} | {permistion}
          </div>
        )
      );
    });
  };

  return (
    <div className="avatar-container">
      {listUsers?.length > 0 &&
        listUsers?.map((item, index) => {
          const imgUrl = item?.imgUrl || "layouts/v7/skins/images/defautAvatar.png";
          const permistion = item?.permission === "read" ? "Đọc" : "Ghi";
          return (
            index < maxCount && (
              <Tooltip key={index} title={`${item?.label} | ${permistion}`} zIndex={2500}>
                <div className="avatar-item">
                  <img height={size} width={size} key={index} src={`https://quocduygroup.com/vtiger/${imgUrl}`} />
                  {listUsers?.length === 1 && <span className="avatar-item-label">{item?.label}</span>}
                </div>
              </Tooltip>
            )
          );
        })}
      {listUsers?.length > maxCount && (
        <Tooltip title={renderMoreUser()} zIndex={2500}>
          <div className="more-avatar" style={{ minWidth: size, minHeight: size, ...moreStyle }}>
            +{listUsers?.length - maxCount}
          </div>
        </Tooltip>
      )}
    </div>
  );
}

export default Avatar;
