import React from "react";
import ServerUrl from "src/constants/ServerUrl";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import "./style.scss";
import DividerCustom from "../../../Divider/index";

function WGSliderItem(props) {
  const { itemData, index } = props;

  return (
    <div id={`slide-${index}`} className="slide-body-container">
      <div className="slide-body-container_content">
        <div className="body-group">
          <div className="slide_info">
            <label>Tiêu đề</label>
            <div className="textValue">
              <span>{itemData.tieu_de}</span>
            </div>
          </div>

          <div className="slide_info">
            <label>Số tài khoản</label>
            <div className="textValue">
              <span>{itemData.stk}</span>
            </div>
          </div>

          <div className="slide_info">
            <label>Ngân hàng</label>
            <div className="textValue">
              <img
                className="textValue_ImageCover"
                src={ServerUrl.urlSub + "assets/icon/MSBBank.svg"}
                width="25px"
                height="25px"
              />
              <span>{itemData.ngan_hang}</span>
            </div>
          </div>

          <div className="slide_info">
            <label>Chi nhánh</label>
            <div className="textValue">
              <span>{itemData.chi_nhanh}</span>
            </div>
          </div>

          <div className="slide_info">
            <label>Nội dung</label>
            <div className="textValue">
              <span>{itemData.noi_dung}</span>
            </div>
          </div>

          <div className="slide_info">
            <label>Người đề nghị</label>
            <div className="textValue">
              <img
                className="textValue_ImageCover circleImage"
                src={itemData?.assigned_user_id?.image}
                width="25px"
                height="25px"
              />
              <span className="text-info">{itemData?.assigned_user_id?.label}</span>
            </div>
          </div>

          <DividerCustom className="divider" />

          <div className="slide_total">
            <label>Tổng cộng</label>
            <div className="textValue textTotal">₫ {itemData.total}</div>
          </div>
        </div>

        <div className="footer-group">
          <span className="btn-action btn-cancel">
            <FaIcon icon="fa-xmark" fontSize={16} /> Không duyệt
          </span>
          <span className="btn-action btn-access ">
            <FaIcon icon="fa-signature" fontSize={16} /> Ký duyệt
          </span>
        </div>
      </div>
    </div>
  );
}

export default WGSliderItem;
