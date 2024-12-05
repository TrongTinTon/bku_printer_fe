import React, { useState } from "react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import ServerUrl from "src/constants/ServerUrl";
import { Button, Popconfirm } from "antd";
import "./style.scss";

function WGComentItem({ itemData, title, icon, colorStyle }) {
  const onHandleView = (event) => {
    onView &&
      onView({
        event,
        values: itemData,
        props: {
          icon: icon,
          title: title,
        },
      });
  };
  return (
    <React.Fragment>
      <div className="CommentItemContainer">
        <div className="CommentItemContainer_review">
          <div className="CommentItemContainer_review_avatarContainer">
            <div className={`avatar ${colorStyle}-gradient-bg`}>
              <img
                src={itemData["assigned_user_id"].image}
                className="avatarImage"
              />
              <div className="avatarIcon">{icon && <img src={icon} />}</div>
            </div>
          </div>
          <div className="CommentItemContainer_review_title">
            <div className="name">
              <p className="text">{itemData.subject}</p>
              {itemData.quotestage && (
                <div className={`status ${colorStyle}-gradient-bg`}>
                  <p className="status_text">{itemData.quotestage}</p>
                </div>
              )}
            </div>
            <div className="content">
              <span>{itemData["account_id"]?.label}</span>
            </div>
            <div className="more"><span>Xem thêm bình luận</span></div>
          </div>
        </div>

        <div className="CommentItemContainer_count">
          <div className="icon">
            <img src={ServerUrl.urlSub + "assets/icon/Comments.svg"} />
          </div>
          <div className="total">{12}</div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default WGComentItem;