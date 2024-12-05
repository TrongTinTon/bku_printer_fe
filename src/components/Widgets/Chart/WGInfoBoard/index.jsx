import { useState } from "react";
import { Spin } from "antd";
import NoResult from "../../../NoResult";
import ChartHeader from "../ChartHeader";
import "./style.scss";

function InfoBoard(props) {
  const { title, data, contentDetail, isLoading } = props;

  const dataNow = data?.[0] || [];

  const renderItemRank = (item, index) => {
    return (
      <div key={index} className="board-item-group">
        <div className="icon">
          <img style={{ height: "25px", width: "25px" }} src={item.iconSrc} />
        </div>
        <div className="group-label">
          <span className="label">{item.title}</span>
          <span className="sub-label">{item.subTitle}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="chart-container">
      <ChartHeader title={title} contentDetail={contentDetail} {...props} />
      <Spin spinning={isLoading} wrapperClassName="loading-spin">
        {dataNow.length > 0 ? (
          <div className="list-board-container">{dataNow.map((item, index) => renderItemRank(item, index))}</div>
        ) : (
          <div className="chart-graph">
            <NoResult width={"125px"} />
          </div>
        )}
      </Spin>
    </div>
  );
}

export default InfoBoard;
