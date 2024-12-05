import React, { Suspense, useEffect } from "react";
import { Form } from "antd";
import appGlobal from "src/global/AppGlobal";
import RenderDiscountTotal from "./RenderDiscountTotal";
import RenderTaxTotal from "./RenderTaxTotal";
import RenderAdjustment from "./RenderAdjustment";

const RenderPayment = React.lazy(() => import("./RenderPayment"));

function RenderBlockTotal(props) {
  const { currency, getDataRecord, form, recordPermissions } = props;

  // Permission record
  const recordEditable = recordPermissions?.editable;

  return (
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

        const totalListprice = (newListItems || []).reduce((total, item) => {
          const { quantity = 0, listprice = 0, discount_amount = 0, discount_percent = 0 } = item || {};
          const itemListprice = +quantity * +listprice;
          const totalDiscount = discount_amount > 0 ? discount_amount : (discount_percent * itemListprice) / 100;
          return total + (itemListprice - totalDiscount);
        }, 0);

        const hdnSubTotal = totalListprice;
        const hdnDiscountTotal = form.getFieldValue("hdnDiscountTotal") || 0;
        const totalAfterDiscount = +hdnSubTotal - +hdnDiscountTotal;
        const hdnTaxTotal = form.getFieldValue("hdnTaxTotal") || 0;
        const txtAdjustment = form.getFieldValue("txtAdjustment") || 0;

        const grandTotal = totalAfterDiscount + hdnTaxTotal + txtAdjustment;

        return (
          <div className="block-total-container">
            <table>
              <tbody>
                {/* Tổng thành tiền */}
                <tr>
                  <td className="td-label">
                    <div className="text-label">Tổng thành tiền</div>
                  </td>
                  <td className="td-value">
                    <div className="text-value disabled" id="hdnSubTotal" data-value={hdnSubTotal}>
                      {currency?.symbol} {appGlobal.formatCurrency(hdnSubTotal, 2)}
                    </div>
                  </td>
                </tr>

                {/* Giảm giá tổng */}
                <RenderDiscountTotal hdnSubTotal={hdnSubTotal} {...props} />

                {/* Tổng sau khi giảm */}
                {!recordEditable && +hdnDiscountTotal === 0 ? null : (
                  <tr>
                    <td className="td-label">
                      <div className="text-label">Tổng sau khi giảm</div>
                    </td>
                    <td className="td-value">
                      <div className="text-value disabled">
                        {currency?.symbol} {appGlobal.formatCurrency(totalAfterDiscount, 2)}
                      </div>
                    </td>
                  </tr>
                )}

                {/* Thuế */}
                <RenderTaxTotal totalAfterDiscount={totalAfterDiscount} {...props} />

                {/* Điều chỉnh giá */}
                <RenderAdjustment {...props} />

                {/* Tổng cộng */}
                <tr>
                  <td className="td-label">
                    <div className="text-label">Tổng cộng</div>
                  </td>
                  <td className="td-value">
                    <div className="text-value disabled" id="grandTotal" data-value={grandTotal}>
                      {currency?.symbol} {appGlobal.formatCurrency(grandTotal, 2)}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Phần thanh toán */}
            <Suspense fallback={<div>Đang tải...</div>}>
              <RenderPayment grandTotal={grandTotal} {...props} />
            </Suspense>
          </div>
        );
      }}
    </Form.Item>
  );
}

export default RenderBlockTotal;
