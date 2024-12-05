import { Tooltip } from "antd";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
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

function RenderCellWithType({ value, columnInfo }) {
  const type = columnInfo?.type?.name;
  const column = columnInfo?.column;

  switch (type) {
    case "reference":
      if (column === "smcreatorid") {
        return <Owner value={value} />;
      }
      return <Reference value={value} tooltip={value?.label} />;

    case "multireference":
      const tooltip = `(${value?.module?.label}) ${value?.label}`;
      return <MultiReference value={value} tooltip={tooltip} />;

    case "currency":
      return value?.value && <Currency value={value?.value} symbol={value?.symbol} />;

    case "currencypicklist":
      return value?.value && <CurrencyPicklist value={value?.value} symbol={value?.symbol} />;

    case "picklist":
      return value?.value && <Picklist value={value} />;

    case "multipicklist":
      return value?.length > 0 && <MultiPicklist value={value} />;

    case "datetime":
      return value && <span className="cell-value">{appGlobal.convertToServerTime(value, "DD-MM-YYYY HH:mm:ss")}</span>;

    case "date":
      return value && <span className="cell-value">{appGlobal.convertToServerTime(value, "DD-MM-YYYY")}</span>;

    case "url":
      return (
        value && (
          <Tooltip title={value} placement="topLeft" zIndex={2500}>
            <a className="cell-link-value">{value}</a>
          </Tooltip>
        )
      );

    case "owner":
      return <Owner value={value} />;

    case "multiowner":
      const moreStyle = {
        fontSize: 12,
        padding: "0 6px",
        borderRadius: 20,
      };
      return value?.length > 0 && <MultioWner value={value} maxCount={5} size={26} moreStyle={moreStyle} />;

    case "string":
    case "text":
    case "email":
    case "phone":
      return (
        value && (
          <Tooltip title={value} placement="topLeft" zIndex={2500}>
            <span className="cell-value">{value}</span>
          </Tooltip>
        )
      );

    case "time":
      return value && <span className="cell-value">{value}</span>;

    case "double":
      return value && value >= 0 && <span className="cell-value">{parseFloat(value)}</span>;

    case "boolean":
      return <Boolean value={value} />;

    default:
      return <span className="cell-value">{type}</span>;
  }
}

export default RenderCellWithType;
