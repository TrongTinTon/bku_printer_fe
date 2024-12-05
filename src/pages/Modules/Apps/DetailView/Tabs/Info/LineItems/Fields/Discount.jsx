import React, { useState, useRef, useEffect } from "react";
import { Radio, Form } from "antd";
import Input from "src/components/Form/Input";

function Discount({ hdnSubTotal, saving, recordData, form, getFieldInfo }) {
  const hdnDiscountPercent = +recordData?.hdnDiscountPercent?.value || 0;
  const hdnDiscountAmount = +recordData?.hdnDiscountAmount?.value || 0;
  const checkDefault = hdnDiscountPercent ? 2 : hdnDiscountAmount ? 3 : 1;

  const [value, setValue] = useState(checkDefault);
  const inputRef = useRef(null);

  const discountPercentInfo = getFieldInfo("hdnDiscountPercent");
  const discountAmountInfo = getFieldInfo("hdnDiscountAmount");

  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
        inputRef.current.select();
      }, 50);
    }
  }, [value]);

  const onChange = (e) => {
    const valueCheck = e.target.value;
    valueCheck === 1 && form.setFieldsValue({ hdnDiscountPercent: 0, hdnDiscountAmount: 0 });
    valueCheck === 2 && form.setFieldsValue({ hdnDiscountAmount: 0 });
    valueCheck === 3 && form.setFieldsValue({ hdnDiscountPercent: 0 });
    setValue(valueCheck);
  };

  const listSelect = [
    { value: 1, label: "Không giảm", isView: true, editable: true },
    { value: 2, label: "Phần trăm (%)", isView: discountPercentInfo, editable: discountPercentInfo?.editable },
    { value: 3, label: "Trực tiếp", isView: discountAmountInfo, editable: discountAmountInfo?.editable },
  ];

  return (
    <div className="discount-container">
      <Radio.Group value={value} onChange={onChange}>
        {listSelect.map(
          (item, index) =>
            item?.isView && (
              <Radio key={index} value={item.value} disabled={saving || !item?.editable}>
                <div className="group-field">
                  <span className="field-label">
                    {item.value === 1 && "Không giảm"}
                    {item.value === 2 && "Phần trăm (%)"}
                    {item.value === 3 && "Trực tiếp"}
                  </span>
                  {value === item.value && (
                    <Form.Item
                      noStyle
                      name={item.value === 2 ? "hdnDiscountPercent" : "hdnDiscountAmount"}
                      initialValue={item.value === 2 ? hdnDiscountPercent : hdnDiscountAmount}>
                      {item.value !== 1 ? (
                        <Input
                          ref={inputRef}
                          className="field-value wrap-left"
                          size="large"
                          type="numbers"
                          formatter={(value) => `${value || 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                          precision={2}
                          min={0}
                          max={item.value === 2 ? 100 : hdnSubTotal}
                          disabled={value !== item.value || saving || !item?.editable}
                        />
                      ) : (
                        <div className="field-value" />
                      )}
                    </Form.Item>
                  )}
                </div>
              </Radio>
            )
        )}
      </Radio.Group>
    </div>
  );
}

export default Discount;
