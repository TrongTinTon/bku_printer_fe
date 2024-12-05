import React, { memo } from "react";
import Input from "src/components/Form/Input";
import appGlobal from "src/global/AppGlobal";
import "./style.scss";

function Currency(props) {
  const { id, value, symbol, mode, autoFocus, onChange, disabled } = props;

  const valueFormat = appGlobal.formatCurrency(value, 2);

  return mode === "edit" ? (
    <div className="field-edit-group">
      <div className="prefix-icon">
        <span>{symbol}</span>
      </div>
      <Input
        id={id}
        className="field-edit-input"
        type="numbers"
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        autoFocus={autoFocus}
        onChange={onChange}
        value={value}
        disabled={disabled}
      />
    </div>
  ) : (
    <>
      <div className="field-string-container">
        <span className="icon-value">{symbol}</span>
        {valueFormat}
      </div>
    </>
  );
}

export default memo(Currency);
