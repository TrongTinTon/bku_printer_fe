import React, { memo, useRef, useEffect } from "react";
import Input from "src/components/Form/Input";
import appGlobal from "src/global/AppGlobal";
import "../style.scss";

function Quantity(props) {
  const { id, value, mode, unit, onChange, disabled, autoFocus } = props;

  const quantityRef = useRef(null);

  useEffect(() => {
    if (mode === "edit" && autoFocus) {
      quantityRef.current?.select();
    }
  }, [mode]);

  return mode === "edit" ? (
    <div className="field-edit-group">
      <Input
        id={id}
        ref={quantityRef}
        className="field-edit-input wrap-left field-quantity-input"
        type="numbers"
        formatter={(value) => `${value || 1}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        precision={2}
        min={1}
        max={99999}
        autoFocus={autoFocus}
        onChange={onChange}
        value={value}
        disabled={disabled}
        handlewrapposition="left"
      />
    </div>
  ) : (
    <>
      <div className="field-detail-container field-quantity">
        <span>{appGlobal.formatCurrency(value, 2)}</span>
        {unit && <span className="icon-value">{unit}</span>}
      </div>
    </>
  );
}

export default memo(Quantity);
