import React, { memo } from "react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import MultiOwner from "src/components/Form/Fields/MultiOwner";
import Owner from "src/components/Form/Fields/Owner";
import MultiPicklist from "src/components/Form/Fields/MultiPicklist";
import Picklist from "src/components/Form/Fields/Picklist";
import Currency from "src/components/Form/Fields/Currency";
import appGlobal from "src/global/AppGlobal";

function RenderFieldWithType({ item }) {
  const FieldWrapper = ({ children }) => {
    return <div className="container">{children}</div>;
  };
  const ValueContainer = ({ previous, current, hidePrevious = false }) => {
    return (
      <>
        {!hidePrevious && (
          <div className="update-from">
            <span className="field-name">
              <FaIcon icon="fa-ban" />
            </span>
            {previous?.label || previous}
          </div>
        )}
        <div className="update-to">
          <span className="field-name">
            <FaIcon icon="fa-check" />
          </span>
          {current?.label || current}
        </div>
      </>
    );
  };

  const Title = ({ title, status }) => {
    return (
      <div className="update-name">
        <span className="field-name">{title}</span>
        <span>{` ${status}`}</span>
      </div>
    );
  };
  switch (item?.fieldType) {
    case "multipicklist":
      return (
        <FieldWrapper>
          <Title title={item?.fieldlabel} status={item?.previous ? `đã thay đổi` : `đã cập nhật`} />
          <ValueContainer
            hidePrevious={item?.previous ? false : true}
            previous={
              <div className="multipicklist">
                <MultiPicklist value={item?.previous} suffixIcon={true} />
              </div>
            }
            current={
              <div className="multipicklist">
                <MultiPicklist value={item?.current} suffixIcon={true} />
              </div>
            }
          />
        </FieldWrapper>
      );
    case "picklist":
      return (
        <FieldWrapper>
          <Title title={item?.fieldlabel} status={item?.previous ? `đã thay đổi` : `đã cập nhật`} />
          <ValueContainer
            hidePrevious={item?.previous ? false : true}
            previous={
              <div className="picklist">
                <Picklist value={item?.previous} />
              </div>
            }
            current={
              <div className="picklist">
                <Picklist value={item?.current} />
              </div>
            }
          />
        </FieldWrapper>
      );
    case "owner":
      return (
        <FieldWrapper>
          <Title title={item?.fieldlabel} status={item?.previous?.imgUrl ? `đã thay đổi` : `đã cập nhật`} />
          <ValueContainer
            hidePrevious={item?.previous?.imgUrl ? false : true}
            previous={<Owner value={item?.previous} />}
            current={<Owner value={item?.current} />}
          />
        </FieldWrapper>
      );
    case "reference":
      return (
        <FieldWrapper>
          <Title title={item?.fieldlabel} status={item?.previous?.imgUrl ? `đã thay đổi` : `đã cập nhật`} />
          <ValueContainer
            hidePrevious={item?.previous?.imgUrl ? false : true}
            previous={<Owner value={item?.previous} />}
            current={<Owner value={item?.current} />}
          />
        </FieldWrapper>
      );
    case "multiowner":
      var moreStyle = { fontSize: 12, padding: "0 6px", borderRadius: 20 };
      return (
        <FieldWrapper>
          <Title title={item?.fieldlabel} status={item.previous ? `đã thay đổi` : `đã cập nhật`} />
          <ValueContainer
            hidePrevious={item?.previous ? false : true}
            previous={<MultiOwner value={item?.previous} maxCount={5} size={26} moreStyle={moreStyle} />}
            current={<MultiOwner value={item?.current} maxCount={5} size={26} moreStyle={moreStyle} />}
          />
        </FieldWrapper>
      );
    case "currencypicklist":
      return (
        <FieldWrapper>
          <Title title={item?.fieldlabel} status={item?.previous?.value ? `đã thay đổi` : `đã cập nhật`} />
          <ValueContainer
            hidePrevious={item?.previous?.value ? false : true}
            previous={<Currency value={item?.previous?.value} />}
            current={<Currency value={item?.current?.value} />}
          />
        </FieldWrapper>
      );
    case "currencyList":
      return (
        <FieldWrapper>
          <Title title={item?.fieldlabel} status={item?.previous?.name ? `đã thay đổi` : `đã cập nhật`} />
          <ValueContainer
            hidePrevious={item?.previous?.value ? false : true}
            previous={<span>{item?.previous?.name}</span>}
            current={<span>{item?.current?.name}</span>}
          />
        </FieldWrapper>
      );
    case "currency":
      return (
        <FieldWrapper>
          <Title title={item?.fieldlabel} status={item?.previous ? `đã thay đổi` : `đã cập nhật`} />
          <ValueContainer
            hidePrevious={item?.previous ? false : true}
            previous={<Currency value={item?.previous} />}
            current={<Currency value={item?.current} />}
          />
        </FieldWrapper>
      );
    case "boolean":
      return (
        <FieldWrapper>
          <Title title={item?.fieldlabel} status={item?.previous ? `đã thay đổi` : `đã cập nhật`} />
          <ValueContainer
            hidePrevious={item?.previous ? false : true}
            previous={<span>{item?.previous === "1" ? "Có" : "Không"}</span>}
            current={<span>{item?.current === "1" ? "Có" : "Không"}</span>}
          />
        </FieldWrapper>
      );
    case "datetime":
      return (
        <FieldWrapper>
          <Title title={item?.fieldlabel} status={item?.previous ? `đã thay đổi` : `đã cập nhật`} />
          <ValueContainer
            hidePrevious={item.previous ? false : true}
            previous={
              <span>
                {item?.previous ? appGlobal.convertToServerTime(item?.previous, "DD-MM-YYYY HH:mm:ss") : null}
              </span>
            }
            current={
              <span>{item?.current ? appGlobal.convertToServerTime(item?.current, "DD-MM-YYYY HH:mm:ss") : null}</span>
            }
          />
        </FieldWrapper>
      );
    case "date":
      return (
        <FieldWrapper>
          <Title title={item?.fieldlabel} status={item?.previous ? `đã thay đổi` : `đã cập nhật`} />
          <ValueContainer
            hidePrevious={item?.previous ? false : true}
            previous={
              <span>{item?.previous ? appGlobal.convertToServerTime(item?.previous, "DD-MM-YYYY") : null}</span>
            }
            current={<span>{item?.current ? appGlobal.convertToServerTime(item?.current, "DD-MM-YYYY") : null}</span>}
          />
        </FieldWrapper>
      );
    case "url":
      return (
        <FieldWrapper>
          <Title title={item?.fieldlabel} status={item?.previous ? `đã thay đổi` : `đã cập nhật`} />
          <ValueContainer
            hidePrevious={item?.previous ? false : true}
            previous={
              <a href={item?.previous}>
                <span>{item?.previous}</span>
              </a>
            }
            current={
              <a href={item?.previous}>
                <span>{item?.current}</span>
              </a>
            }
          />
        </FieldWrapper>
      );
    case "double":
      return (
        <FieldWrapper>
          <Title title={item?.fieldlabel} status={item?.previous ? `đã thay đổi` : `đã cập nhật`} />
          <ValueContainer
            hidePrevious={item?.previous ? false : true}
            previous={<span>{item?.previous ? parseFloat(item.previous) : item?.previous}</span>}
            current={<span>{item?.current ? parseFloat(item.current) : item?.current}</span>}
          />
        </FieldWrapper>
      );
    default:
      return (
        <FieldWrapper>
          <Title title={item?.fieldlabel} status={item?.previous ? `đã thay đổi` : `đã cập nhật`} />
          <ValueContainer
            hidePrevious={item?.previous ? false : true}
            previous={<span>{item?.previous}</span>}
            current={<span>{item?.current}</span>}
          />
        </FieldWrapper>
      );
  }
}

export default memo(RenderFieldWithType);
