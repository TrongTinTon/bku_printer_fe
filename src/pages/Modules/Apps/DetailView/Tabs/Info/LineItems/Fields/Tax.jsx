import React, { useState, useRef, useEffect } from "react";
import { Radio, Form } from "antd";
import Input from "src/components/Form/Input";

function Tax({ saving, recordData, form }) {
  const inputRef = useRef(null);

  const lineItems = recordData?.LineItems || [];
  const tax = +lineItems?.[0]?.tax1 || 0;

  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
        inputRef.current.select();
      }, 50);
    }
  }, []);

  return (
    <div className="tax-container">
      <div className="group-field">
        <Form.Item noStyle name={"tax1"} initialValue={tax}>
          <Input
            ref={inputRef}
            className="field-value wrap-left"
            size="large"
            type="numbers"
            formatter={(value) => `${value || 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            precision={2}
            min={0}
            max={100}
            disabled={saving}
          />
        </Form.Item>
      </div>
    </div>
  );
}

export default Tax;
