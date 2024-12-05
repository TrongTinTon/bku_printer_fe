import React, { memo, useRef, useEffect } from "react";
import Input from "src/components/Form/Input";
import appGlobal from "src/global/AppGlobal";
import "../style.scss";

function Listprice(props) {
  const { id, value, mode, symbol, onChange, disabled, autoFocus } = props;

  const listpriceRef = useRef(null);

  const formatValue = appGlobal.formatCurrency(value || 0, 2);

  useEffect(() => {
    if (mode === "edit" && autoFocus) {
      listpriceRef.current?.select();
    }
  }, [mode]);

  return mode === "edit" ? (
    <div className="field-edit-group">
      <Input
        id={id}
        ref={listpriceRef}
        className="field-edit-input wrap-left field-listprice-input"
        type="numbers"
        formatter={(value) => `${value || 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        precision={2}
        min={0}
        onChange={onChange}
        autoFocus={autoFocus}
        value={value}
        disabled={disabled}
      />
    </div>
  ) : (
    <>
      <div className="field-detail-container flex-end">
        <span className="icon-value">{symbol}</span>
        <span>{formatValue}</span>
      </div>
    </>
  );
}

export default memo(Listprice);
