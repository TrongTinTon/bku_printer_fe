import React from "react";
import appGlobal from "../../../global/AppGlobal";
import { Select as AntdSelect, Empty, Tag } from "antd";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import ServerUrl from "src/constants/ServerUrl";
import "./style.scss";

const { Option, OptGroup } = AntdSelect;
function Select(props) {
  const customOptions = props["customoptions"];
  const renderEmpty = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" />;
  const onChange = props?.onChange;
  const valueReturn = props?.valuereturn;
  const closeafterselect = props?.closeafterselect;

  const onChangeOption = (value, option) => {
    const optionData = customOptions?.find((item) => item?.value === value);
    let returnOption = value;

    if (valueReturn === "object") {
      const itemBase = customOptions?.find((itemBase) => itemBase?.value === option?.value);
      returnOption = { value: option?.value, picklistColor: itemBase?.picklistColor, ...option, ...optionData };
    } else if (valueReturn === "array") {
      returnOption = option?.map((item) => {
        const itemBase = customOptions?.find((itemBase) => itemBase?.value === item?.value);
        return { value: item?.value, picklistColor: itemBase?.picklistColor };
      });
    }

    if (props?.mode === "multiple" && props?.type === "owner" && valueReturn === "array") {
      returnOption?.map((item) => (item["permission"] = "write"));
    }

    onChange && onChange(returnOption);
    closeafterselect && props?.selectref?.current?.blur();
  };

  const renderOption = () => {
    return customOptions.map((item, index) => {
      const isGroups = item?.options?.length > 0;
      return isGroups ? (
        <OptGroup key={index} label={item.label}>
          {item.options.map((item, index) => {
            return renderOptionItem(item, index, isGroups);
          })}
        </OptGroup>
      ) : (
        renderOptionItem(item, index, isGroups)
      );
    });
  };

  const renderOptionItem = (item, index, isGroups) => {
    const colors = item?.picklistColor;
    const color1 = colors?.color;
    const color2 = colors?.color2;
    const hasColors = color1 && color2;

    switch (props?.type) {
      case "owner":
        const imgSrc = item?.imgUrl ? item?.imgUrl : "layouts/v7/skins/images/defautAvatar.png";
        return (
          <Option
            disabled={item?.disabled}
            key={`${item.value}-index`}
            value={item?.value}
            title={item?.label}
            className="owner-option-container">
            <img className="owner-img" src={`https://quocduygroup.com/vtiger/${imgSrc}`} />
            <span className={"owner-label"}>{item?.label}</span>
            {props?.ownericon && (
              <span className="owner-icon">
                <FaIcon icon={props?.ownericon} />
              </span>
            )}
          </Option>
        );
      case "onlyModuleIcon":
        const iconModuleSrc = `${ServerUrl.urlSub}assets/icon/${item?.value}.svg`;
        return (
          <Option
            disabled={item?.disabled}
            key={`${item?.value}-index`}
            value={item?.value}
            title={item?.label}
            className="moduleicon-option-container">
            <div className="module-icon">
              <img src={iconModuleSrc} />
            </div>
            <span className="module-label">{item?.label}</span>
          </Option>
        );
      case "module":
        return (
          <Option disabled={item?.disabled} key={`${item?.value}-index`} value={item?.value} title={item?.label}>
            <span className="module-label">{item?.label}</span>
          </Option>
        );
      case "productid":
        const image = item?.imagename?.[0];
        const imgUrl = image?.imgUrl ? image?.imgUrl : "test/default.jpg";
        return (
          <Option
            className="product-option-container"
            disabled={item?.disabled}
            key={`${item?.value}-index`}
            value={item?.value}
            title={item?.label}>
            <div className="product-img">
              <img src={`${ServerUrl.value}/${imgUrl}`} width={30} height={30} />
            </div>
            <span className="product-label">
              {item?.label} {item?.productcode && <span className="product-model"> - {item?.productcode}</span>}
            </span>
          </Option>
        );
      default:
        return (
          <Option disabled={item?.disabled} key={`${item?.value}-index`} value={item?.value} title={item?.label}>
            <span
              className={hasColors ? "bage-item-select" : "not-bage-item-select"}
              style={{
                background: hasColors
                  ? `linear-gradient(310deg, ${hasColors ? color2 : "#F3F5F9"}, ${hasColors ? color1 : "#F3F5F9"})`
                  : "#F3F5F9",
              }}>
              {item?.label}
            </span>
          </Option>
        );
    }
  };

  const tagRender = (propsItem) => {
    const { label, value, closable, onClose } = propsItem;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        className={`multi-select tag-${props?.type}`}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}>
        {label}
      </Tag>
    );
  };

  return (
    <AntdSelect
      ref={props?.selectref}
      showSearch
      allowClear
      optionFilterProp="children"
      filterOption={(input, option) => {
        const optionLabel = option?.label || option?.title || "";
        return appGlobal.removeVNAccents(optionLabel.toLowerCase() ?? "").includes(input?.toLowerCase());
      }}
      className={`app-select ${props.classcustom ?? ""}`}
      popupClassName="app-select-popup"
      suffixIcon={<FaIcon icon={"fa-chevron-down"} color="#899aba" fontSize={12} />}
      notFoundContent={renderEmpty}
      tagRender={props.mode === "multiple" && tagRender}
      {...props}
      onChange={onChangeOption}>
      {customOptions?.length > 0 && renderOption()}
    </AntdSelect>
  );
}

export default Select;
