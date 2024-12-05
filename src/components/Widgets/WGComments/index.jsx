import React from "react";
import WGComentItem from "./WGComentItem";
import "./style.scss";

function WGComments(props) {
  const { title, count, icon, color, listData, colorStyle } = props;

  return (
    <div className="commentListContainer">
      <div className="commentListContainer_body">
        {listData.length > 0 &&
          listData.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <WGComentItem itemData={item} title={title} icon={icon} colorStyle={colorStyle} />
              </React.Fragment>
            );
          })}
      </div>
    </div>
  );
}

export default WGComments;
