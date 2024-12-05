/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useRef, memo, useEffect } from "react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { Form, Button, Popconfirm } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import appGlobal from "src/global/AppGlobal";
import Image from "src/components/Form/Fields/Image";
import ServerUrl from "src/constants/ServerUrl";
import Listprice from "./Fields/Listprice";
import Quantity from "./Fields/Quantity";
import Comment from "./Fields/Comment";
import ProductName from "./Fields/ProductName";

function RenderItem(props) {
  const {
    form,
    item,
    index,
    currency,
    isAdmin,
    getFieldInfo,
    isEditing,
    reloadTabInfo,
    recordData,
    recordPermissions,
    module,
    saveDataRecord,
  } = props;

  const moduleName = module?.name;
  const lineitemId = item?.lineitem_id;
  const fomatQuantity = +item?.quantity || 1;
  const entitytype = item?.entitytype;
  const labelEntity = entitytype === "Products" ? "Sản phẩm" : "Dịch vụ";
  const productName = item?.productname;
  const brandName = item?.cf_brandname;
  const model = item?.productcode || item?.service_no;
  const isRefund = item?.isrefund === "on";
  const unitPrice = item?.unit_price || 0;
  const purchaseCost = item?.purchase_cost || 0;
  const currencyPurchase = { value: item?.currency_purchase?.id || 1, symbol: item?.currency_purchase?.symbol || "₫" };
  const isNew = lineitemId.includes("new") && !item?.productid;

  // Permission field
  const perListprice = recordData?.listprice && getFieldInfo("listprice");
  const perQuantity = recordData?.quantity && getFieldInfo("quantity");
  const perComment = recordData?.comment && getFieldInfo("comment");

  // Permission record
  const recordEditable = recordPermissions?.editable;

  const [mode, setMode] = useState(isNew ? "edit" : "detail");
  const [saving, setSaving] = useState(false);

  const fieldEdit = useRef(null);

  useEffect(() => {
    isEditing.current = mode === "edit";
  }, []);

  // Handle edit lineitem
  const onEditField = useCallback(
    (field) => {
      if (isEditing.current) return;
      const selectionString = window.getSelection().toString();
      if (mode === "detail" && !selectionString) {
        fieldEdit.current = field;
        isEditing.current = true;
        form.resetFields();
        setMode("edit");
      }
    },
    [mode, item]
  );

  // Handle cancel edit lineitem
  const onCancel = useCallback(() => {
    isEditing.current = false;
    form.resetFields();
    if (item?.productid) {
      setMode("detail");
    } else {
      handleRemoveEmpty();
    }
  }, [recordData]);

  // Handle remove lineitem
  const onRemove = useCallback(async () => {
    setSaving(true);
    try {
      const listLineitem = recordData?.LineItems?.filter((lineitem) => lineitem?.lineitem_id !== lineitemId).map(
        (lineitem) => ({ lineitem_id: lineitem?.lineitem_id })
      );

      await saveDataRecord({ LineItems: listLineitem });
    } finally {
      isEditing.current = false;
      setMode("detail");
      setSaving(false);
      reloadTabInfo();
      handleReloadLineItem();
    }
  }, [recordData]);

  // Handle save lineitem
  const onFinish = useCallback(async () => {
    setSaving(true);

    try {
      const values = form.getFieldsValue();
      const data = {};

      const hasChange = checkFormChange();

      if (!hasChange) {
        onCancel();
        return;
      }

      Object.keys(values).forEach((key) => {
        if (key.includes("||")) {
          const [fieldName, id] = key.split("||");
          const value = values[key];
          data["lineitem_id"] = id;
          data[fieldName] = value?.value || value;
        }
      });

      const hdnSubTotal = document.getElementById("hdnSubTotal")?.dataset?.value || 0;
      const grandTotal = document.getElementById("grandTotal")?.dataset?.value || 0;
      const balance = document.getElementById("balance")?.dataset?.value || 0;

      const listLineitem = recordData?.LineItems?.filter((lineitem) => lineitem?.lineitem_id !== data?.lineitem_id).map(
        (lineitem) => ({ lineitem_id: lineitem?.lineitem_id })
      );

      await saveDataRecord({ LineItems: [...listLineitem, data], hdnSubTotal, grandTotal, balance });
    } finally {
      isEditing.current = false;
      setMode("detail");
      setSaving(false);
      reloadTabInfo();
      handleReloadLineItem();
    }
  }, [form, recordData]);

  // handle Remove Empty
  const handleRemoveEmpty = useCallback(() => {
    const btnRemove = document.getElementById("btnRemoveEmptyLineItem");
    btnRemove?.click();
  }, []);

  // handle Reload LineItem
  const handleReloadLineItem = useCallback(() => {
    const btnReload = document.getElementById("btnReloadLineItem");
    btnReload?.click();
  }, []);

  // Check form change
  const checkFormChange = useCallback(() => {
    const values = form.getFieldsValue();
    const fieldChecks = ["quantity", "listprice", "comment", "productid"];
    return Object.keys(values).some((key) => {
      if (key.includes("||")) {
        const [fieldName, id] = key.split("||");
        if (fieldChecks.includes(fieldName)) {
          return fieldName === "productid" ? item[fieldName] !== values[key]?.value : +item[fieldName] !== +values[key];
        }
      }
      return false;
    });
  }, [form, recordData]);

  // FieldWrapper component
  const FieldWrapper = ({ element, fieldName, rules = [], value, childrenProps, notStyle, editable }) => {
    const FieldChildren = element;
    const isFocus = fieldEdit.current === fieldName;
    const hasEdit = editable && recordEditable;

    if (notStyle) {
      return mode === "detail" ? (
        <FieldChildren value={value} item={item} {...childrenProps} />
      ) : (
        <Form.Item name={`${fieldName}||${lineitemId}`} initialValue={value} noStyle>
          <FieldChildren mode={mode} item={item} {...childrenProps} />
        </Form.Item>
      );
    }

    return mode === "detail" ? (
      <div
        className={`field-lineitem-detail ${!hasEdit && "disabled"}`}
        onClick={() => hasEdit && onEditField(fieldName)}>
        <FieldChildren mode={mode} value={value} item={item} {...childrenProps} />
      </div>
    ) : (
      <Form.Item
        name={`${fieldName}||${lineitemId}`}
        rules={rules}
        initialValue={value}
        className="field-lineitem-edit">
        <FieldChildren mode={mode} autoFocus={isFocus} item={item} {...childrenProps} />
      </Form.Item>
    );
  };

  return (
    <>
      <tr className={`ajax-${mode}`}>
        {/* Hình ảnh */}
        <td className="td-image">
          <div className="num-row">{index + 1}</div>
          <FieldWrapper element={RenderImage} fieldName="imagename" value={item?.image} notStyle />
          <FieldWrapper element={RenderTax1} fieldName="tax1" value={item?.tax1} notStyle />

          <FieldWrapper element={RenderBrandName} fieldName="cf_brandname" value={brandName} notStyle />

          {entitytype === "Products" && (
            <FieldWrapper element={RenderQtyInStock} fieldName="qtyinstock" value={item?.qtyinstock || 0} notStyle />
          )}
        </td>

        {/* Tên sản phẩm */}
        <td className="td-productname">
          <FieldWrapper
            element={ProductName}
            fieldName="productid"
            childrenProps={{ module: module, form: form, disabled: saving }}
            value={{
              value: item?.productid,
              label: productName,
              module: { name: entitytype, label: labelEntity },
            }}
            editable={perListprice?.editable || perQuantity?.editable}
          />

          <FieldWrapper element={RenderModel} fieldName="productcode" value={model} notStyle />

          {perComment && (
            <FieldWrapper
              element={Comment}
              fieldName="comment"
              value={item?.comment}
              editable={perComment?.editable}
              childrenProps={{ disabled: saving }}
            />
          )}

          {isRefund && (
            <div className="group-refund" title="Sản phẩm hoàn trả">
              <img src={`${ServerUrl.urlSub}assets/images/refund.png`} alt="refund" />
            </div>
          )}
        </td>

        {/* Số lượng */}
        {perQuantity && (
          <td className="td-quantity">
            <FieldWrapper
              element={Quantity}
              fieldName="quantity"
              value={fomatQuantity}
              childrenProps={{ unit: item?.usageunit, disabled: saving }}
              editable={perQuantity?.editable}
            />
          </td>
        )}

        {/* Đơn giá  currency_purchase*/}
        {perListprice && (
          <td className="td-listprice">
            <FieldWrapper
              element={Listprice}
              fieldName="listprice"
              value={item?.listprice}
              childrenProps={{ symbol: currency?.symbol, disabled: saving }}
              editable={perListprice?.editable}
            />

            {isAdmin && (
              <div className="purchare-value">
                <FieldWrapper
                  element={RenderCurrencyPurchase}
                  fieldName="currency_purchase"
                  value={moduleName === "PurchaseOrder" ? { value: 1, symbol: "₫" } : currencyPurchase}
                  childrenProps={{
                    module: module,
                  }}
                  notStyle
                />
                <FieldWrapper
                  element={RenderPurchase}
                  fieldName="purchase_cost"
                  value={moduleName === "PurchaseOrder" ? unitPrice : purchaseCost}
                  notStyle
                />
              </div>
            )}
          </td>
        )}

        {/* Thành tiền */}
        {perListprice && <RenderTotalListPrice item={item} form={form} currency={currency} />}
      </tr>
      {mode === "edit" && (
        <tr>
          <td className="td-group-action" colSpan={perListprice ? 5 : 3}>
            <Form.Item className="group-lineitem-btn-ajax" shouldUpdate>
              {() => {
                const productid = form.getFieldValue(`productid||${lineitemId}`)?.value;

                return (
                  <div className="group-btn">
                    {/* Button remove item */}
                    {recordData?.LineItems?.length > 1 && !isNew && isEditing.current && (
                      <Popconfirm
                        title={`Xóa ${labelEntity}?`}
                        description={
                          <span>
                            Bạn chắc chắn muốn xóa <b>{productName}</b>?
                          </span>
                        }
                        overlayClassName="popconfirm-remove-lineitem"
                        icon={<FaIcon icon={"fa-regular fa-trash-can"} color="#F63A46" />}
                        getPopupContainer={() => document.querySelector(".group-lineitem-btn-ajax")}
                        okText={
                          <div className="btn-confirm">
                            {saving && <LoadingOutlined style={{ fontSize: 16 }} spin />} <span>Đồng ý</span>
                          </div>
                        }
                        cancelText={
                          <div className="btn-deny">
                            <span>Hủy</span>
                          </div>
                        }
                        okButtonProps={{ loading: false }}
                        cancelButtonProps={{ disabled: saving }}
                        onConfirm={onRemove}>
                        <Button className="btn-remove" disabled={saving}>
                          <FaIcon icon={"fa-regular fa-trash-can"} />
                          Xóa
                        </Button>
                      </Popconfirm>
                    )}

                    {/* Button close edit */}
                    <Button className="btn-cancel" onClick={onCancel} disabled={saving}>
                      <FaIcon icon={"fa-xmark"} />
                      Hủy
                    </Button>

                    {/* Button save edit */}
                    <Button className="btn-save" disabled={saving || !productid} onClick={onFinish}>
                      {saving ? <LoadingOutlined style={{ fontSize: 20 }} spin /> : <FaIcon icon={"fa-check"} />}
                      Lưu
                    </Button>
                  </div>
                );
              }}
            </Form.Item>
          </td>
        </tr>
      )}
    </>
  );
}

const RenderTax1 = () => {
  return <div className="group-tax1"></div>;
};

const RenderImage = ({ value }) => {
  const renderMask = (
    <div className="mask-content">
      <FaIcon icon={"fa-eye"} />
      <span>Xem</span>
    </div>
  );
  return <Image values={value} oneImage={true} styleImg={{ width: "100%", height: "100px" }} renderMask={renderMask} />;
};

const RenderBrandName = ({ value }) => {
  return value && <div className="brand-name">{value}</div>;
};

const RenderModel = ({ value }) => {
  return <div className="group-model">{value || <span className="default">Model</span>}</div>;
};

const RenderQtyInStock = ({ value }) => {
  return (
    <div className={`group-qty-instock ${value > 0 && "active"}`}>
      <FaIcon icon={"fa-regular fa-clock"} />
      {value > 0 ? `Tồn: ${value}` : "Hết hàng"}
    </div>
  );
};

const RenderPurchase = ({ value, module }) => {
  return (
    <>
      <span>{appGlobal.formatCurrency(value || 0, 2)}</span>
    </>
  );
};

const RenderCurrencyPurchase = ({ value, module }) => {
  const moduleName = module?.name;
  return (
    <>
      <span>{moduleName === "PurchaseOrder" ? "Giá bán: " : "Giá mua: "}</span>
      <span>{value?.symbol} </span>
    </>
  );
};

const RenderTotalListPrice = ({ currency, form, item }) => {
  const lineitemId = item?.lineitem_id;

  return (
    <td className="td-total-listprice">
      <Form.Item noStyle shouldUpdate>
        {() => {
          const formQuantity = form.getFieldValue(`quantity||${lineitemId}`) || +item?.quantity;
          const formListprice = form.getFieldValue(`listprice||${lineitemId}`);

          const listprice = formListprice === undefined ? +item?.listprice : formListprice;
          const totalListprice = (formQuantity || 1) * listprice || 0;
          const discountAmount = +item?.discount_amount || 0;
          const discountPercent = +item?.discount_percent || 0;
          const totalDiscount = discountAmount > 0 ? discountAmount : (discountPercent * totalListprice) / 100;
          const totalAfterDiscount = totalListprice - totalDiscount;

          return (
            <>
              <div className="total-after-discount">
                <span>{currency?.symbol}</span>
                {appGlobal.formatCurrency(totalAfterDiscount, 2)}
              </div>

              {totalDiscount > 0 && (
                <>
                  <div className="total-listprice-value">{appGlobal.formatCurrency(totalListprice, 2)}</div>
                  <div className="total-discount">
                    {discountPercent > 0 && `(${discountPercent}%) `}-{appGlobal.formatCurrency(totalDiscount, 2)}
                  </div>
                </>
              )}
            </>
          );
        }}
      </Form.Item>
    </td>
  );
};

export default memo(RenderItem);
