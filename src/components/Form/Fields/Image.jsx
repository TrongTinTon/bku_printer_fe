import React, { memo } from "react";
import { Image as AndImage } from "antd";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import appGlobal from "src/global/AppGlobal";
import "./style.scss";

function Image({ values, oneImage, styleImg, renderMask }) {
  const defaultImage = "test/default.jpg";
  const width = styleImg?.width || 150;
  const height = styleImg?.height || 150;

  const renderMaskItem = renderMask || (
    <div className="mask-content">
      <FaIcon icon={"fa-eye"} />
      <span>Bấm để xem</span>
    </div>
  );
  const renderCount = (current, total) => {
    const infoImg = values?.[current - 1];
    const timeCreated = appGlobal.convertToServerTime(infoImg?.createdtime, "DD-MM-YYYY HH:mm:ss");

    const onShowInfo = (e) => {
      e.stopPropagation();
      const imgInfoContainer = document.querySelector(".img-info-container");
      const btnShowInfo = document.querySelector(".icon-btn-show");
      const isHide = imgInfoContainer?.classList.contains("hide");
      if (isHide) {
        imgInfoContainer?.classList.remove("hide");
        btnShowInfo?.classList.add("rotate");
      } else {
        imgInfoContainer?.classList.add("hide");
        btnShowInfo?.classList.remove("rotate");
      }
    };

    return (
      <div className="group-img-infomation">
        {infoImg && (
          <div className="img-info-container hide">
            <div className="group-value">
              <span className="info-label">
                <FaIcon icon={"fa-image"} />
              </span>
              <span className="info-value">{infoImg?.name}</span>
            </div>
            <div className="group-value">
              <span className="info-label">
                <FaIcon icon={"fa-clock"} />
              </span>
              <span className="info-value">{timeCreated}</span>
            </div>
            <div className="group-value">
              <span className="info-label">
                <FaIcon icon={"fa-user"} />
              </span>
              <span className="info-value">{infoImg?.smcreatorid?.label}</span>
            </div>
          </div>
        )}
        {infoImg?.name && (
          <div className="btn-show-info" onClick={onShowInfo}>
            <span>
              {current} / {total}
            </span>
            <span>Xem thông tin</span>
            <span className="icon-btn-show">
              <FaIcon icon={"fa-chevron-down"} />
            </span>
          </div>
        )}
      </div>
    );
  };
  return (
    <div className="field-image-container">
      <AndImage.PreviewGroup
        preview={{
          countRender: renderCount,
          zIndex: 2500,
        }}
        items={
          oneImage
            ? values?.map((item) => {
                const { id, imgUrl, name } = item;
                return {
                  src: `https://quocduygroup.com/vtiger/${imgUrl || defaultImage}`,
                  key: id,
                  width: width,
                  height: height,
                  title: name,
                };
              })
            : false
        }>
        {oneImage ? (
          <AndImage
            preview={{
              mask: renderMaskItem,
            }}
            placeholder={true}
            width={width}
            height={height}
            src={`https://quocduygroup.com/vtiger/${values?.[0]?.imgUrl || defaultImage}`}
          />
        ) : (
          values?.map((item, index) => {
            const { imgUrl } = item;
            return (
              <AndImage
                preview={{
                  mask: renderMaskItem,
                }}
                placeholder={true}
                key={index}
                width={width}
                height={height}
                src={`https://quocduygroup.com/vtiger/${imgUrl || defaultImage}`}
              />
            );
          })
        )}
      </AndImage.PreviewGroup>
    </div>
  );
}

export default memo(Image);
