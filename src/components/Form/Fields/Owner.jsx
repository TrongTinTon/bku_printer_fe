import React, { memo } from "react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import Select from "src/components/Form/Select";
import "./style.scss";

function Owner(props) {
  const { id, value, mode, autoFocus, disabled, onChange, userInfo, suffixIcon } = props;

  const name = value?.label;
  const imgSrc = value?.imgUrl || "layouts/v7/skins/images/defautAvatar.png";

  const listOwner = userInfo?.users ? [...userInfo?.users, ...userInfo?.groups] : [];

  return mode === "edit" ? (
    <div className="field-edit-group">
      <Select
        id={id}
        className="field-ajax-Owner"
        customoptions={listOwner}
        size="large"
        autoFocus={autoFocus}
        defaultOpen={autoFocus}
        allowClear={false}
        disabled={disabled}
        value={+value?.value}
        onChange={onChange}
        valuereturn={"object"}
        type="owner"
      />
    </div>
  ) : (
    <>
      <div className="field-owner-container">
        <img className="owner-img" src={`https://quocduygroup.com/vtiger/${imgSrc}`} />
        <span className="owner-name">{name}</span>
      </div>
      {suffixIcon && <FaIcon className={`icon-value ${suffixIcon === "fa-crown" && "owner"}`} icon={suffixIcon} />}
    </>
  );
}

export default memo(Owner);
