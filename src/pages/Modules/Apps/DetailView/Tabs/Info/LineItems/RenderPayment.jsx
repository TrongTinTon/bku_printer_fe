import React, { useRef } from "react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import Divider from "src/components/Divider";
import PaymentInvoice from "src/pages/Modules/Inventory/Invoice/PaymentInvoice";
import PaymentPO from "src/pages/Modules/Inventory/PurchaseOrder/PaymentPO";
import PaymentItem from "./Fields/PaymentItem";

function RenderPayment(props) {
  const { module } = props;

  const paymentInvoiceFields = useRef([
    { paymentDay: "cf_1706", paymentValue: "received" },
    { paymentDay: "cf_1708", paymentValue: "received2" },
    { paymentDay: "cf_1710", paymentValue: "received3" },
    { paymentDay: "cf_1712", paymentValue: "received4" },
    { paymentDay: "cf_1714", paymentValue: "received5" },
    { paymentDay: "cf_1858", paymentValue: "received6" },
    { paymentDay: "cf_1860", paymentValue: "received7" },
    { paymentDay: "cf_1862", paymentValue: "received8" },
    { paymentDay: "cf_1864", paymentValue: "received9" },
    { paymentDay: "cf_1866", paymentValue: "received10" },
  ]);

  const paymentPOFields = useRef([
    { paymentDay: "cf_1972", paymentValue: "paid" },
    { paymentDay: "cf_1952", paymentValue: "paid1" },
    { paymentDay: "cf_1954", paymentValue: "paid2" },
    { paymentDay: "cf_1956", paymentValue: "paid3" },
    { paymentDay: "cf_1958", paymentValue: "paid4" },
    { paymentDay: "cf_1960", paymentValue: "paid5" },
    { paymentDay: "cf_1962", paymentValue: "paid6" },
    { paymentDay: "cf_1964", paymentValue: "paid7" },
    { paymentDay: "cf_1966", paymentValue: "paid8" },
    { paymentDay: "cf_1968", paymentValue: "paid9" },
  ]);

  const renderDivider = () => {
    return (
      <div className="group-divider">
        <Divider className="divider-payment" />
        <div className="label-payment">
          <span>Phần thanh toán</span>
        </div>
      </div>
    );
  };

  switch (module?.name) {
    case "Invoice":
      return (
        <PaymentInvoice
          paymentFields={paymentInvoiceFields.current}
          divider={renderDivider}
          PaymentItem={PaymentItem}
          {...props}
        />
      );
    case "PurchaseOrder":
      return (
        <PaymentPO
          paymentFields={paymentPOFields.current}
          divider={renderDivider}
          PaymentItem={PaymentItem}
          {...props}
        />
      );
    default:
      return null;
  }
}

export default RenderPayment;
