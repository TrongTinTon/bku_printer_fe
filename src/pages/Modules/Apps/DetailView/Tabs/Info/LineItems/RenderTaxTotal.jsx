import React, { useEffect, useState } from "react";
import { Form, Popconfirm } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import appGlobal from "src/global/AppGlobal";
import Tax from "./Fields/Tax";

const RenderTaxTotal = (props) => {
  const { totalAfterDiscount, recordData, form, saveDataRecord, reloadTabInfo, isEditing, recordPermissions } = props;

  const [openEdit, setOpenEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  // Permission record
  const recordEditable = recordPermissions?.editable;

  const lineItems = recordData?.LineItems || [];
  const tax = +lineItems?.[0]?.tax1 || 0;

  const formTax = form.getFieldValue("tax1");
  const taxValue = formTax === undefined ? tax : formTax;

  const totalTax = (taxValue * +totalAfterDiscount) / 100;

  useEffect(() => {
    form.setFieldsValue({ hdnTaxTotal: totalTax });
  }, [form, totalTax]);

  // Show popconfirm
  const showPopconfirm = () => {
    if (isEditing.current || !recordEditable) return;
    isEditing.current = true;
    setOpenEdit(true);
  };

  // Handle confirm
  const handleConfirm = async () => {
    const data = (lineItems || []).map((item) => ({ lineitem_id: item?.lineitem_id, tax1: taxValue }));
    if (tax === taxValue) return (isEditing.current = setOpenEdit(false));

    setSaving(true);
    try {
      await saveDataRecord({ LineItems: data });
    } finally {
      setSaving(false);
      reloadTabInfo();
      isEditing.current = setOpenEdit(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    isEditing.current = false;
    setOpenEdit(false);
    form.resetFields(["tax1"]);
  };

  return (
    <tr>
      <td className={`td-label info`}>
        <div className="label-popconfirm">
          <Popconfirm
            title={"Thuế VAT (%)"}
            description={<Tax saving={saving} recordData={recordData} form={form} {...props} />}
            open={openEdit}
            overlayClassName="popconfirm-edit-tax"
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
                Thuế {`(${taxValue}%)`}
              </span>
            </div>
          </Popconfirm>
        </div>
      </td>
      <td className="td-value success">
        <Form.Item name="hdnTaxTotal" noStyle>
          <div className="text-value disabled">+{appGlobal.formatCurrency(totalTax, 2)}</div>
        </Form.Item>
      </td>
    </tr>
  );
};

export default RenderTaxTotal;
