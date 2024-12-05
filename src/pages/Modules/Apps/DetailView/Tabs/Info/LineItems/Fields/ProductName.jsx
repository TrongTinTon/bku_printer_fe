import React, { memo } from "react";
import ServerUrl from "src/constants/ServerUrl";
import Reference from "src/components/Form/Reference";

function ProductName(props) {
  const { id, value, module, mode, onChange, disabled, autoFocus, form, item } = props;

  const moduleValue = value?.module?.name || value?.module;

  const labelEntity = moduleValue === "Products" ? "Sản phẩm" : "Dịch vụ";
  const imgModule = `${ServerUrl.urlSub}assets/icon/${moduleValue}.svg`;
  const imgDefault = [{ imgUrl: `test/default.jpg` }];

  const onClickProduct = (e) => {
    e.stopPropagation();
    const url = `/erp/listview?module=${moduleValue}&record=${value?.value}`;
    window.open(url, "_blank");
  };

  const onChangeProduct = (value) => {
    const lineitemId = item?.lineitem_id;
    const listPrice = (module.name === "PurchaseOrder" ? value?.purchase_cost?.value : value?.unit_price?.value) || 0;
    const purchaseCost =
      (module.name === "PurchaseOrder" ? value?.unit_price?.value : value?.purchase_cost?.value) || 0;
    const currencyPurchase = { value: value?.purchase_cost?.id, symbol: value?.purchase_cost?.symbol };
    const brandName = value?.cf_brandname?.value || "";
    const imagename = value?.imagename || imgDefault;
    const productcode = value?.productcode || value?.service_no || "";
    const qtyinstock = value?.qtyinstock || 0;

    if (value) {
      form.setFieldsValue({
        [`listprice||${lineitemId}`]: listPrice,
        [`cf_brandname||${lineitemId}`]: brandName,
        [`imagename||${lineitemId}`]: imagename,
        [`productcode||${lineitemId}`]: productcode,
        [`qtyinstock||${lineitemId}`]: qtyinstock,
        [`purchase_cost||${lineitemId}`]: purchaseCost,
        [`currency_purchase||${lineitemId}`]: currencyPurchase,
      });
    }

    onChange(value);
  };

  return mode === "edit" ? (
    <div className="field-edit-group field-productname-input">
      <Reference
        id={id}
        field={"productid"}
        module={module}
        allowClear={false}
        autoFocus={autoFocus}
        disabled={disabled}
        value={value}
        onChange={onChangeProduct}
        customOption={true}
        iconSearch={<img src={imgModule} alt={moduleValue} title={labelEntity} width={16} />}
      />
    </div>
  ) : (
    <div className="field-detail-container field-productname">
      <span onClick={onClickProduct} title={value?.label}>
        {value?.label}
      </span>
      <img src={imgModule} alt={moduleValue} title={labelEntity} />
    </div>
  );
}

export default memo(ProductName);
