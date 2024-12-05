/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, useState, memo, useCallback, useRef, useEffect } from "react";
import { Form } from "antd";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import ServerUrl from "src/constants/ServerUrl";
import appGlobal from "src/global/AppGlobal";
import RenderBlockTotal from "./RenderBlockTotal";
import RenderSkeletonItem from "./RenderSkeletonItem";
import "./style.scss";

const RenderItem = React.lazy(() => import("./RenderItem"));

function RenderBlockLineItem(props) {
  const { userInfo, blockData, getFieldInfo, isLoading, getDataRecord } = props;
  const [form] = Form.useForm();

  const records = getDataRecord() || {};
  const recordData = records?.record || {};

  const lineItems = recordData?.LineItems || [];
  const permissions = records?.permission || {};

  // Field value
  const currency = recordData?.currency_id;
  const isAdmin = userInfo?.is_admin === "on";
  const isListprice = recordData?.listprice && getFieldInfo("listprice");
  const isQuantity = recordData?.quantity && getFieldInfo("quantity");

  // Handle save
  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <Form form={form} name={`ajax-lineitem`} className="ajax-lineitem-form" onFinish={onFinish}>
      <div className="block-lineitem-container" id={`block-${blockData?.id}`}>
        <div className="header-lineitem">
          <div className="group-left">
            <span>Chi tiết sản phẩm</span>
          </div>
          <div className="group-right">
            {currency?.value && (
              <div className="currency-info">
                <FaIcon icon={"fa-coins"} />
                <span>
                  {currency?.name} ({currency?.symbol})
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="table-lineitem">
          <table>
            <thead>
              <tr>
                <th className="th-image">HÌNH ẢNH</th>
                <th className="th-productname">TÊN SẢN PHẨM & DỊCH VỤ</th>
                {isQuantity && (
                  <th className="th-quantity" style={{ width: isListprice ? "10%" : "20%" }}>
                    SỐ LƯỢNG
                  </th>
                )}
                {isListprice && (
                  <>
                    <th className="th-listprice">ĐƠN GIÁ ({currency?.symbol})</th>
                    <th className="th-total-listprice">THÀNH TIỀN ({currency?.symbol})</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {/* Line item */}
              {isLoading ? (
                <RenderSkeletonItem />
              ) : (
                <Suspense
                  fallback={
                    <tr>
                      <td>Đang tải...</td>
                    </tr>
                  }>
                  <RenderListItem
                    lineItems={lineItems}
                    currency={currency}
                    isAdmin={isAdmin}
                    recordData={recordData}
                    permissions={permissions}
                    isQuantity={isQuantity}
                    isListprice={isListprice}
                    form={form}
                    {...props}
                  />
                </Suspense>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isListprice && !isLoading && (
        <RenderBlockTotal
          currency={currency}
          recordData={recordData}
          form={form}
          recordPermissions={permissions}
          {...props}
        />
      )}
    </Form>
  );
}

const RenderListItem = memo((props) => {
  const { form, lineItems, permissions, isLoading, isQuantity, isListprice, isEditing, getDataRecord } = props;

  const [lineItemsState, setLineItemsState] = useState(lineItems);
  const countItemNew = useRef(1);

  // Handle add line item
  const addLineItem = (type) => {
    if (isEditing.current) return;
    const getLineItems = getDataRecord()?.record?.LineItems || [];
    const tax = +getLineItems?.[0]?.tax1 || 0;

    const newItem = {
      lineitem_id: `new-${lineItemsState?.length + countItemNew.current}`,
      productid: "",
      quantity: 1,
      listprice: 0,
      entitytype: type,
      tax1: tax,
    };

    countItemNew.current += 1;
    setLineItemsState((prev) => [...prev, newItem]);
  };

  // Handle filter line item
  const handleRemoveEmpty = () => {
    const newListItems = lineItemsState?.filter((item) => item?.productid);
    setLineItemsState(newListItems);
  };

  // Handle reload line item
  const reloadLineItem = useCallback(async () => {
    const newLineItems = getDataRecord()?.record?.LineItems || [];
    await setLineItemsState(newLineItems);
    form.resetFields();
  }, []);

  return (
    <>
      {lineItemsState?.map((item, index) => (
        <RenderItem key={index} item={item} index={index} recordPermissions={permissions} {...props} />
      ))}

      {/* Tổng cộng */}
      {(isQuantity || isListprice) && !isLoading && <RenderSubTotal addLineItem={addLineItem} {...props} />}

      <tr hidden>
        <td>
          <div id="btnRemoveEmptyLineItem" onClick={handleRemoveEmpty} hidden></div>
          <div id="btnReloadLineItem" onClick={reloadLineItem} hidden></div>
        </td>
      </tr>
    </>
  );
});

const RenderSubTotal = memo((props) => {
  const { module, isQuantity, isListprice, currency, form, moduleLists, permissions, addLineItem, getDataRecord } =
    props;
  const moduleShowListprice = ["In", "Ra"];
  const productInfo = moduleLists?.find((item) => item?.name === "Products");
  const serviceInfo = moduleLists?.find((item) => item?.name === "Services");
  const recordEditable = permissions?.editable;
  const hasListprice = moduleShowListprice.some((item) => item === module?.name) || isListprice;

  return (
    <tr className="tr-total">
      {/* Button add */}

      <td className="td-add-lineitem">
        {recordEditable && hasListprice ? (
          <div className="group-btn-add">
            {productInfo && (
              <div className="btn-add-product" onClick={() => addLineItem("Products")}>
                <FaIcon icon={"fa-plus"} color="#268dff" />
                <img src={`${ServerUrl.urlSub}assets/icon/Products.svg`} alt={"add-product"} width={16} />
              </div>
            )}
            {serviceInfo && (
              <div className="btn-add-service" onClick={() => addLineItem("Services")}>
                <FaIcon icon={"fa-plus"} color="#fba136" />
                <img src={`${ServerUrl.urlSub}assets/icon/Services.svg`} alt={"add-product"} width={16} />
              </div>
            )}
          </div>
        ) : (
          <div />
        )}
      </td>

      <td className="td-total-label">
        <span>Tổng cộng</span>
      </td>

      {(isQuantity || isListprice) && (
        <Form.Item noStyle shouldUpdate={() => true}>
          {() => {
            const lineItems = getDataRecord()?.record?.LineItems || [];
            const listFieldValue = form.getFieldsValue();
            const findLineItem = Object.keys(listFieldValue).find((item) => item.includes("productid"));
            const lineitemId = findLineItem?.split("||")[1];
            const isNew = lineitemId?.includes("new");

            const quantity = listFieldValue[`quantity||${lineitemId}`] || 1;
            const listprice = listFieldValue[`listprice||${lineitemId}`] || 0;

            const newListItems = (lineItems || []).map((item) =>
              item?.lineitem_id === lineitemId ? { ...item, quantity, listprice } : item
            );

            if (isNew) newListItems.push({ lineitem_id: lineitemId, quantity, listprice });

            const totalQuatity = isQuantity
              ? (newListItems || []).reduce((total, item) => total + +(item?.quantity || 0), 0)
              : 0;

            const totalListprice = isListprice
              ? (newListItems || []).reduce((total, item) => {
                  const { quantity = 0, listprice = 0, discount_amount = 0, discount_percent = 0 } = item || {};
                  const itemListprice = +quantity * +listprice;
                  const totalDiscount =
                    discount_amount > 0 ? discount_amount : (discount_percent * itemListprice) / 100;
                  return total + (itemListprice - totalDiscount);
                }, 0)
              : 0;

            return (
              <>
                {isQuantity && (
                  <td className="td-total-qty">
                    <span>{totalQuatity}</span>
                  </td>
                )}

                {isListprice && (
                  <>
                    <td className="td-listprice">
                      <span />
                    </td>
                    <td className="td-total-price">
                      <span>{currency?.symbol} </span>
                      <span>{appGlobal.formatCurrency(totalListprice, 2)}</span>
                    </td>
                  </>
                )}
              </>
            );
          }}
        </Form.Item>
      )}
    </tr>
  );
});

export default memo(RenderBlockLineItem);
