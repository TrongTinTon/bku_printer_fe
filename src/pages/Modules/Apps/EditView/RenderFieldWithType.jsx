/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useRef } from "react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { Form, Select, App as AntdApp } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import appGlobal from "src/global/AppGlobal";
import Owner from "src/components/Form/Fields/Owner";
import Picklist from "src/components/Form/Fields/Picklist";
import MultiPicklist from "src/components/Form/Fields/MultiPicklist";
import MultioWner from "src/components/Form/Fields/MultiOwner";
import Reference from "src/components/Form/Fields/Reference";
import MultiReference from "src/components/Form/Fields/MultiReference";
import Boolean from "src/components/Form/Fields/Boolean";
import Currency from "src/components/Form/Fields/Currency";
import CurrencyPicklist from "src/components/Form/Fields/CurrencyPicklist";
import Image from "src/components/Form/Fields/Image";
import String from "src/components/Form/Fields/String";
import Phone from "src/components/Form/Fields/Phone";
import Email from "src/components/Form/Fields/Email";
import Url from "src/components/Form/Fields/Url";
import Integer from "src/components/Form/Fields/Integer";
import Date from "src/components/Form/Fields/Date";
import Textarea from "src/components/Form/Fields/Textarea";
import Time from "src/components/Form/Fields/Time";

function RenderFieldWithType(props) {
  const { module, fieldInfo, userInfo } = props;

  const fieldType = fieldInfo?.type?.name;
  const uitype = fieldInfo?.type?.uitype;
  const fieldName = fieldInfo?.name;
  const mandatory = fieldInfo?.mandatory;

  const FieldWrapper = ({ element, value, type, childrenProps, valuePropName }) => {
    const FieldChildren = element;
    return (
      <Form.Item
        name={fieldName}
        className="field-edit-value"
        initialValue={value}
        valuePropName={valuePropName}
        rules={[
          { required: true, message: <FaIcon icon={"fa-circle-exclamation"} /> },
          { type: type, message: <FaIcon icon={"fa-circle-exclamation"} /> },
        ]}>
        <FieldChildren allowClear={!mandatory} mode="edit" autoFocus={false} {...childrenProps} />
      </Form.Item>
    );
  };

  switch (fieldType) {
    // Done
    case "phone":
      return <FieldWrapper value={""} element={Phone} />;

    // Done
    case "url":
      return <FieldWrapper value={""} type="url" element={Url} />;

    // Done
    case "email":
      return <FieldWrapper value={""} element={Email} />;

    // Done
    case "date":
      const valueDate = "";
      const convertDate = valueDate ? dayjs(valueDate, "YYYY-MM-DD") : "";
      return <FieldWrapper value={convertDate} element={Date} />;

    // Done
    case "picklist":
      const picklistValues = fieldInfo?.type?.picklistValues;
      return (
        <FieldWrapper
          value={null}
          element={Picklist}
          childrenProps={{ picklistValues: picklistValues, suffixIcon: "fa-list-check" }}
        />
      );

    // Done
    case "multipicklist":
      const multipicklistValues = fieldInfo?.type?.picklistValues;
      return (
        <FieldWrapper
          value={[]}
          element={MultiPicklist}
          childrenProps={{ picklistValues: multipicklistValues, suffixIcon: "fa-list-check" }}
        />
      );

    // Done
    case "datetime":
      const valueDateTime = "";
      const convertDateTime = valueDateTime ? appGlobal.convertToServerTime(valueDateTime, "DD-MM-YYYY HH:mm:ss") : "";
      return <div className="item-value">{convertDateTime}</div>;

    // Done
    case "time":
      const valueTime = "";
      return <FieldWrapper value={valueTime} element={Time} />;

    // Done
    case "owner":
      return (
        <FieldWrapper
          value={{ value: 1 }}
          element={Owner}
          childrenProps={{ userInfo: userInfo, suffixIcon: "fa-crown" }}
        />
      );

    // Done
    case "multiowner":
      return (
        <FieldWrapper
          value={[]}
          element={MultioWner}
          childrenProps={{
            userInfo: userInfo,
            fieldInfo: fieldInfo,
            suffixIcon: "users",
          }}
        />
      );

    // Done
    case "reference":
      if (uitype === "52") {
        return (
          <FieldWrapper
            value={""}
            element={Owner}
            childrenProps={{ userInfo: userInfo, suffixIcon: "fa-magnifying-glass" }}
          />
        );
      }
      return (
        <FieldWrapper
          value={""}
          element={Reference}
          childrenProps={{ parentModule: module, fieldInfo: fieldInfo, suffixIcon: "fa-magnifying-glass" }}
        />
      );

    // Done
    case "multireference":
      return (
        <FieldWrapper
          value={""}
          element={MultiReference}
          childrenProps={{ parentModule: module, fieldInfo: fieldInfo, suffixIcon: true }}
        />
      );

    // Done
    case "image":
      const valueImages = [];
      return valueImages?.length > 0 ? (
        <div className="item-value no-border no-background no-edited">
          <Image values={valueImages} />
        </div>
      ) : (
        <div className="item-value no-edited disabled" />
      );

    // Done
    case "boolean":
      const value = "";
      return <FieldWrapper value={value} element={Boolean} valuePropName="checked" />;

    // Done
    case "integer":
    case "double":
      return <FieldWrapper value={0} element={Integer} />;

    // Done
    case "currency":
      return <FieldWrapper value={0} childrenProps={{ symbol: "" }} element={Currency} />;

    // Done
    case "currencypicklist":
      const currencyField = `currency_${fieldInfo?.id}`;
      const currency = "";

      return (
        <FieldWrapper
          value={0}
          childrenProps={{
            currency: currency,
            FormItem: Form.Item,
            fieldId: fieldInfo?.id,
            userInfo: userInfo,
          }}
          element={CurrencyPicklist}
        />
      );

    // Done
    case "text":
    case "textarea":
      return <FieldWrapper value={""} type={"string"} element={Textarea} />;

    // Done
    case "string":
      return <FieldWrapper value={""} type={"string"} element={String} />;

    default:
      return (
        <div className="item-value">
          {fieldType} - {uitype}
        </div>
      );
  }
}

export default RenderFieldWithType;
