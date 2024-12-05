import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { Carousel } from "antd";
import WGSliderItem from "./WGSliderItem";
import NoResult from "src/components/NoResult";

import "./style.scss";

function WGSlider(props) {
  const { title, icon, listData } = props;

  const PrevArrow = ({ onClick }) => {
    return (
      <div className="preBtn" onClick={onClick}>
        <FaIcon icon="fa-chevron-left" />
      </div>
    );
  };

  const NextArrow = ({ onClick }) => {
    return (
      <div className="nextBtn" onClick={onClick}>
        <FaIcon icon="fa-chevron-right" />
      </div>
    );
  };

  const settings = {
    arrows: true,
    dots: true,
    infinite: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="WGSlider">
      <div className="header-group">
        <div className="label-group">
          <img src={icon} height="20px" />
          <span className="label">{title}</span>
        </div>
      </div>
      <div className="divider-group">
        <div className="circle circle-right"></div>
        <div className="hr"></div>
        <div className="circle circle-left"></div>
      </div>
      <Carousel {...settings}>
        {listData && listData.length > 0 ? (
          listData.map((item, index) => (
            <div key={index}>
              <WGSliderItem itemData={item} index={index} />
            </div>
          ))
        ) : (
          <NoResult />
        )}
      </Carousel>
    </div>
  );
}

export default WGSlider;
