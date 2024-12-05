import React, { useEffect, useState } from "react";
import { Form, Popconfirm } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import appGlobal from "src/global/AppGlobal";
import Discount from "./Fields/Discount";

const RenderDiscountTotal = (props) => {
  const { hdnSubTotal, recordData, form, saveDataRecord, isEditing, recordPermissions, reloadTabInfo } = props;

  const [openEdit, setOpenEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  // Permission record
  const recordEditable = recordPermissions?.editable;

  const hdnDiscountPercent = +recordData?.hdnDiscountPercent?.value || 0;
  const hdnDiscountAmount = +recordData?.hdnDiscountAmount?.value || 0;

  const formPercent = form.getFieldValue("hdnDiscountPercent");
  const formAmount = form.getFieldValue("hdnDiscountAmount");

  const discountPercent = formPercent === undefined ? hdnDiscountPercent : formPercent;
  const discountAmount = formAmount === undefined ? hdnDiscountAmount : formAmount;

  const totalDiscount = discountAmount > 0 ? discountAmount : (discountPercent * hdnSubTotal) / 100;

  useEffect(() => {
    form.setFieldsValue({ hdnDiscountTotal: totalDiscount });
  }, [form, totalDiscount]);

  // Show popconfirm
  const showPopconfirm = () => {
    if (isEditing.current || !recordEditable) return;
    isEditing.current = true;
    setOpenEdit(true);
  };

  // Handle confirm
  const handleConfirm = async () => {
    const data = { hdnDiscountPercent: discountPercent, hdnDiscountAmount: discountAmount };
    const isChangeDiscount = hdnDiscountPercent !== discountPercent || hdnDiscountAmount !== discountAmount;

    if (!isChangeDiscount) return (isEditing.current = setOpenEdit(false));

    setSaving(true);

    try {
      await saveDataRecord(data);
    } finally {
      setSaving(false);
      reloadTabInfo();
      isEditing.current = setOpenEdit(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setOpenEdit(false);
    isEditing.current = false;
    form.resetFields(["hdnDiscountPercent", "hdnDiscountAmount"]);
  };

  return !recordEditable && totalDiscount === 0 ? null : (
    <tr>
      <td className={`td-label info`}>
        <div className="label-popconfirm">
          <Popconfirm
            title={`Giảm giá của: ${appGlobal.formatCurrency(hdnSubTotal, 2)}`}
            description={<Discount {...props} />}
            open={openEdit}
            overlayClassName="popconfirm-edit-discount"
            icon={false}
            okText={
              <div className="group-btn">
                {saving ? <LoadingOutlined style={{ fontSize: 16 }} spin /> : <FaIcon icon={"fa-check"} />}
                <span>Lưu</span>
              </div>
            }
            cancelText={
              <div className="group-btn">
                <FaIcon icon="fa-xmark" />
                <span>Hủy</span>
              </div>
            }
            cancelButtonProps={{ disabled: saving }}
            okButtonProps={{ disabled: saving, loading: false }}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            destroyTooltipOnHide={true}
            getPopupContainer={() => document.querySelector(".block-total-container")}>
            <div className="text-label">
              <span className={recordEditable ? "btn-link" : ""} onClick={showPopconfirm}>
                Giảm thành tiền {discountPercent > 0 && discountAmount === 0 && `(${discountPercent}%)`}
              </span>
            </div>
          </Popconfirm>
        </div>
      </td>
      <td className="td-value error">
        <Form.Item name="hdnDiscountTotal" initialValue={totalDiscount} noStyle>
          <div className="text-value disabled">-{appGlobal.formatCurrency(totalDiscount, 2)}</div>
        </Form.Item>
      </td>
    </tr>
  );
};

export default RenderDiscountTotal;
