import React from "react";
import "./style.scss";

function WGBoxList(props) {
  const { title, icon, iconBG, listData, colorStyle, renderItem } = props;
  return (
    <div className="box-container">
      <div className="block-title">
        <div className="title-left">
          {icon && <img src={icon} height="20px" />}
          <span>{title}</span>
        </div>
        <div className="title-middle">
          <img src={iconBG} className="cover imageOne" />
          <img src={iconBG} className="cover imageTwo" />
        </div>
        {listData.length > 0 && (
          <div className="title-right">
            <div className={`boxBadge ${colorStyle}-gradient-bg`}>
              <div className="boxBadge_content">
                <span>{listData.length}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="block-content">{renderItem && renderItem(listData, colorStyle, icon)}</div>
    </div>
  );
}

export default WGBoxList;
