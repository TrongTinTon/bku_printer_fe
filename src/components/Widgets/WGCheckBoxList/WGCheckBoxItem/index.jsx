import React, { useState } from "react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { Button, Popconfirm } from "antd";
import "./style.scss";

function WGCheckBoxItem({ itemData, title, icon, colorStyle, setSelection }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setIsChecked(true);
      // push selected value in list
      setSelection((prev) => ({
        ...prev,
        onChange: true,
        data: [...prev.data, itemData],
      }));
    } else {
      setIsChecked(false);
      // remove unchecked value from the list
      setSelection((prev) => ({
        ...prev,
        data: prev.data.filter((x) => x.id !== itemData.id),
      }));
    }
  };

  return (
    <label
      className={`labelCheckBoxIem ${isChecked === true ? "itemSelect" : ""}`}
    >
      <input type="checkbox" className="checkboxIcon" onChange={handleChange} />{" "}
      <span className="checkmark">
        {" "}
        <FaIcon icon="fa-check" />
      </span>
      <div className="labelCheckBoxIem_checkBoxItemContainer">
        <div className="labelCheckBoxIem_checkBoxItemContainer_review">
          <div className="labelCheckBoxIem_checkBoxItemContainer_review_avatarContainer">
            <div className={`avatar ${colorStyle}-gradient-bg`}>
              <img
                src={itemData["assigned_user_id"].image}
                width="48"
                height="48"
              />
            </div>
          </div>
          <div className="labelCheckBoxIem_checkBoxItemContainer_review_title">
            <div className="name">
              <span>{itemData.name}</span>
            </div>
            <div className="department">
              <span className="disable">{itemData.model} </span>
              <span className="disable divider">{"|"}</span>
              <span className="info">{itemData["account_id"].label}</span>
            </div>
          </div>
        </div>
        <div className="labelCheckBoxIem_checkBoxItemContainer_action">
          <div className="quantityContainer">
            <span className="info">1</span>
            <span className="space disable">/</span>
            <span className="error">2</span>
          </div>
        </div>
      </div>
    </label>
  );
}

export default WGCheckBoxItem;