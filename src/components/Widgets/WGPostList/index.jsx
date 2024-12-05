import React from "react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import WGPostItem from "./WGPostItem";
import "./style.scss";

function WGPostList(props) {
  const { title, listData } = props;
  return (
    <div className="postListContainer">
      <div className="postListContainer_blockTile">
        <div className="postListContainer_blockTile_left">
          <span>{title}</span>
        </div>
        <div className="postListContainer_blockTile_right">
          <div className={`btnAll`}>
            <div className="btnAll_around">
              <FaIcon icon="fa-arrow-right" />
            </div>
          </div>
        </div>
      </div>
      <div className="postListContainer_body">
        {listData.length > 0 &&
          listData.map((item, index) => {
            return (
              <div key={index}>
                <WGPostItem itemData={item} title={title} />
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default WGPostList;
