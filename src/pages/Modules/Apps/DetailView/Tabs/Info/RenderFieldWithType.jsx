/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useRef } from "react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { Form, Button, App as AntdApp } from "antd";
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
  const { message } = AntdApp.useApp();
  const [form] = Form.useForm();

  const {
    module,
    fieldInfo,
    fieldValue,
    isDisabled,
    isEditing,
    saveDataRecord,
    recordData,
    blockId,
    userInfo,
    reloadTabInfo,
  } = props;

  const fieldType = fieldInfo?.type?.name;
  const uitype = fieldInfo?.type?.uitype;
  const fieldName = fieldInfo?.name;
  const fieldLabel = fieldInfo?.label;
  const mandatory = fieldInfo?.mandatory;

  const [mode, setMode] = useState("detail");
  const [itemSaving, setItemSaving] = useState(false);

  // Handle edit
  const onEditField = useCallback(() => {
    if (isDisabled || isEditing.current) return;

    const selectionString = window.getSelection().toString();
    if (mode === "detail" && !selectionString) {
      isEditing.current = true;
      form.resetFields();
      changeStatusBlockLabel("enable");
      setMode("edit");
    }
  }, [mode]);

  // Handle save
  const onFinish = useCallback((values) => {
    const arrayValues = Object.keys(values)
      .map((key) => {
        const isTouched = form.isFieldTouched(key);
        const value = values[key];
        return isTouched ? { name: key, value: value } : null;
      })
      ?.filter((item) => item);

    const formatValues = appGlobal.formatValuesForSave({ values: arrayValues, fieldInfo: fieldInfo });

    const setInit = () => {
      isEditing.current = false;
      changeStatusBlockLabel("disable");
      setMode("detail");
      setItemSaving(false);
      reloadTabInfo();
    };

    if (arrayValues?.length > 0) {
      setItemSaving(true);

      const save = saveDataRecord(formatValues);
      save.then((res) => {
        setInit();
      });
    } else {
      setInit();
    }
  }, []);

  // Handle error
  const onFailed = useCallback(({ values }) => {
    const value = values[fieldName];
    const title = value ? (
      <span>
        Trường <b>{fieldLabel}</b> không đúng định dạng!
      </span>
    ) : (
      <span>
        Trường <b>{fieldLabel}</b> không được để trống!
      </span>
    );
    message.error(title, [2]);
  }, []);

  // Handle cancel
  const onCancel = useCallback(() => {
    isEditing.current = false;
    changeStatusBlockLabel("disable");
    setMode("detail");
  }, []);

  const changeStatusBlockLabel = useCallback((status) => {
    const blockLabel = document.querySelector(`#blockLabel-${blockId}`);
    if (blockLabel) {
      status === "disable" && blockLabel.classList.remove("active");
      status === "enable" && blockLabel.classList.add("active");
    }
  }, []);

  const FieldWrapper = ({ className, element, value, type, childrenProps, valuePropName }) => {
    const FieldChildren = element;
    return mode === "detail" ? (
      <div className={`item-value ${className}`} onClick={onEditField}>
        <FieldChildren id={`detail-${fieldName}`} value={value} mode={mode} {...childrenProps} />
      </div>
    ) : (
      <Form form={form} name={`ajax-${fieldName}`} className="ajax-form" onFinish={onFinish} onFinishFailed={onFailed}>
        <Form.Item
          name={fieldName}
          className="field-edit-value"
          initialValue={value}
          valuePropName={valuePropName}
          rules={[{ required: mandatory, type: type || fieldType }]}>
          <FieldChildren
            mode={mode}
            autoFocus={true}
            allowClear={!mandatory}
            disabled={itemSaving}
            {...childrenProps}
          />
        </Form.Item>

        <Form.Item>
          <div className="group-btn-ajax">
            <Button className="btn-cancel" onClick={onCancel} disabled={itemSaving}>
              <FaIcon icon={"fa-xmark"} />
            </Button>
            <Button className="btn-save" type="primary" htmlType="submit" disabled={itemSaving}>
              {itemSaving ? <LoadingOutlined style={{ fontSize: 20 }} spin /> : <FaIcon icon={"fa-check"} />}
            </Button>
          </div>
        </Form.Item>
      </Form>
    );
  };

  switch (fieldType) {
    // Done
    case "phone":
      return <FieldWrapper value={fieldValue?.value} element={Phone} />;

    // Done
    case "url":
      return <FieldWrapper value={fieldValue?.value} element={Url} />;

    // Done
    case "email":
      return <FieldWrapper value={fieldValue?.value} element={Email} />;

    // Done
    case "date":
      const valueDate = fieldValue?.value;
      const convertDate = valueDate ? dayjs(valueDate, "YYYY-MM-DD") : "";
      return <FieldWrapper value={convertDate} element={Date} />;

    // Done
    case "picklist":
      const picklistValues = fieldInfo?.type?.picklistValues;
      return (
        <FieldWrapper
          value={fieldValue?.value}
          element={Picklist}
          childrenProps={{ picklistValues: picklistValues, suffixIcon: "fa-list-check" }}
        />
      );

    // Done
    case "multipicklist":
      const multipicklistValues = fieldInfo?.type?.picklistValues;
      return (
        <FieldWrapper
          value={fieldValue?.value}
          element={MultiPicklist}
          childrenProps={{ picklistValues: multipicklistValues, suffixIcon: "fa-list-check" }}
        />
      );

    // Done
    case "datetime":
      const valueDateTime = fieldValue?.value;
      const convertDateTime = valueDateTime ? appGlobal.convertToServerTime(valueDateTime, "DD-MM-YYYY HH:mm:ss") : "";
      return <div className="item-value">{convertDateTime}</div>;

    // Done
    case "time":
      const valueTime = fieldValue?.value ? dayjs(fieldValue?.value, "HH:mm") : "";
      return <FieldWrapper value={valueTime} element={Time} />;

    // Done
    case "owner":
      return (
        <FieldWrapper
          value={fieldValue?.value}
          element={Owner}
          childrenProps={{ userInfo: userInfo, suffixIcon: "fa-crown" }}
        />
      );

    // Done
    case "multiowner":
      return (
        <FieldWrapper
          value={fieldValue?.value || []}
          element={MultioWner}
          childrenProps={{
            userInfo: userInfo,
            fieldInfo: fieldInfo,
            suffixIcon: "users",
            onCancel: onCancel,
            onFinish: onFinish,
          }}
        />
      );

    // Done
    case "reference":
      if (uitype === "52") {
        return (
          <FieldWrapper
            value={fieldValue?.value}
            element={Owner}
            childrenProps={{ userInfo: userInfo, suffixIcon: "fa-magnifying-glass" }}
          />
        );
      }
      return (
        <FieldWrapper
          value={fieldValue?.value}
          element={Reference}
          childrenProps={{ parentModule: module, fieldInfo: fieldInfo, suffixIcon: "fa-magnifying-glass" }}
        />
      );

    // Done
    case "multireference":
      return (
        <FieldWrapper
          value={fieldValue?.value}
          element={MultiReference}
          childrenProps={{ parentModule: module, fieldInfo: fieldInfo, suffixIcon: true }}
        />
      );

    // Done
    case "image":
      const valueImages = fieldValue?.value;
      return valueImages?.length > 0 ? (
        <div className="item-value no-border no-background no-edited">
          <Image values={valueImages} />
        </div>
      ) : (
        <div className="item-value no-edited disabled" />
      );

    // Done
    case "boolean":
      const value = fieldValue?.value === "1" ? true : false;
      return <FieldWrapper value={value} element={Boolean} valuePropName="checked" />;

    // Done
    case "integer":
    case "double":
      return <FieldWrapper value={fieldValue?.value * 1 || 0} element={Integer} />;

    // Done
    case "currency":
      return (
        <FieldWrapper
          value={fieldValue?.value * 1 || 0}
          childrenProps={{ symbol: fieldValue?.symbol }}
          element={Currency}
        />
      );

    // Done
    case "currencypicklist":
      const currencyField = `currency_${fieldInfo?.id}`;
      const currency = recordData[currencyField]?.value;

      return (
        <FieldWrapper
          value={fieldValue?.value * 1 || 0}
          childrenProps={{
            currency: currency,
            FormItem: Form.Item,
            fieldId: fieldValue?.fieldId,
            userInfo: userInfo,
          }}
          element={CurrencyPicklist}
        />
      );

    // Done
    case "text":
    case "textarea":
      return <FieldWrapper value={fieldValue?.value} type={"string"} element={Textarea} />;

    // Done
    case "string":
      return <FieldWrapper value={fieldValue?.value} type={"string"} element={String} />;

    default:
      return (
        <div className="item-value">
          {fieldType} - {uitype}
        </div>
      );
  }
}

export default RenderFieldWithType;
