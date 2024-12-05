import React, { useState } from "react";
import ServerUrl from "src/constants/ServerUrl";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import appGlobal from "src/global/AppGlobal";
import "./style.scss";

function WGPostItem({ itemData, title }) {
  const [heartChecked, setHeartChecked] = useState(false);
  const [loadMoreContent, setLoadMoreContent] = useState(false);
  const onHeartChecked = (event) => {
    setHeartChecked(!heartChecked);
  };

  const onLoadMoreContent = () => {
    setLoadMoreContent(!loadMoreContent);
  };

  return (
    <React.Fragment>
      <div className="postItemContainer">
        <div className="postItemContainer_review">
          <div className="postItemContainer_review_postImageContainer">
            <div className={`postImage`}>
              <img src={itemData["post_image"]?.[0]} width="85" height="85" />
            </div>
          </div>
          <div className="postItemContainer_review_title">
            <div className="infoOwner">
              <img
                className="infoOwner_avatar"
                src={itemData["assigned_user_id"].image}
                width="25"
                height="25"
              />
              <span className="infoOwner_name">
                {itemData["assigned_user_id"].label}
              </span>
              <div className="infoOwner_divider">
                <span>.</span>
              </div>

              <div className="infoOwner_modifiedtime">
                <span className="">{itemData.modifiedtime}</span>
              </div>
              <div className="infoOwner_divider">
                <span>.</span>
              </div>
              <div className="infoOwner_viewCount">
                <FaIcon icon="fa-eye" />
                <p className="">{itemData.view_count}</p>
              </div>
            </div>
            <div className="content">
              {loadMoreContent === false ? (
                <span>
                  {appGlobal.stringEndOverflow(itemData.contents, 150, 152)}
                </span>
              ) : (
                <span>{itemData.contents}</span>
              )}
              {itemData.contents.length > 195 && (
                <span className="content_btnMore" onClick={onLoadMoreContent}>
                  {loadMoreContent === true ? "Ẩn bớt" : "Xem thêm"}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="interactContainer">
          <div
            onClick={onHeartChecked}
            className={`interactContainer_whiteHeart ${
              heartChecked ? "error-gradient-bg" : ""
            }`}
          >
            <img src={ServerUrl.urlSub + "assets/icon/WhiteHeart.svg"} />
          </div>
          <div className="interactContainer_like">
            <div className="interactContainer_like_item">
              <div className="icon">
                <img src={ServerUrl.urlSub + "assets/icon/Smile.svg"} />
              </div>
              <div className="likeCount">{itemData["interest"]?.smile}</div>
            </div>
            <div className="interactContainer_like_item">
              <div className="icon">
                <img src={ServerUrl.urlSub + "assets/icon/Heart.svg"} />
              </div>
              <div className="likeCount">{itemData["interest"]?.heart}</div>
            </div>
            <div className="interactContainer_like_item">
              <div className="icon ">
                <img src={ServerUrl.urlSub + "assets/icon/Like.svg"} />
              </div>
              <div className="likeCount">{itemData["interest"]?.like}</div>
            </div>
          </div>
          <div className="interactContainer_comments">
            <div className="icon">
              <img src={ServerUrl.urlSub + "assets/icon/Comments.svg"} />
            </div>
            <div className="commentCount">{itemData["comments"].length}</div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default WGPostItem;