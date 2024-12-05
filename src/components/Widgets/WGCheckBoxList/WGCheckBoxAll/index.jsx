import React, { useState } from "react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { Button, Popconfirm } from "antd";
import "./style.scss";

function WGCheckBoxAll({ itemData, title, icon, colorStyle, setSelection }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (e) => {
    // const { value, checked } = e.target;
    // if (checked) {
    //   setIsChecked(true);
    //   // push selected value in list
    //   setSelection((prev) => ({
    //     ...prev,
    //     onChange: true,
    //     data: [...prev.data, itemData],
    //   }));
    // } else {
    //   setIsChecked(false);
    //   // remove unchecked value from the list
    //   setSelection((prev) => ({
    //     ...prev,
    //     data: prev.data.filter((x) => x.id !== itemData.id),
    //   }));
    // }
  };

  return (
    <label
      className={`labelCheckBoxAll ${isChecked === true ? "itemSelect" : ""}`}
    >
      <input type="checkbox" className="checkboxIcon" onChange={handleChange} />{" "}
      <span className="checkmark">
        {" "}
        <FaIcon icon="fa-check" />
      </span>
      <div className="labelCheckBoxAll_checkBoxItemContainer">
        <div className="labelCheckBoxAll_checkBoxItemContainer_review">
          <span>Tên sản phẩm</span>
        </div>
        <div className="labelCheckBoxAll_checkBoxItemContainer_review">
          <span>Hợp đồng / tồn kho </span>
        </div>
      </div>
    </label>
  );
}

export default WGCheckBoxAll;