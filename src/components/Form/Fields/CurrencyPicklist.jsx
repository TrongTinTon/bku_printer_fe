import React, { memo } from "react";
import Input from "src/components/Form/Input";
import Select from "src/components/Form/Select";
import appGlobal from "src/global/AppGlobal";

function CurrencyPicklist(props) {
  const { id, FormItem, userInfo, value, currency, mode, autoFocus, onChange, disabled, fieldId } = props;

  const valueFormat = appGlobal.formatCurrency(value, 2);

  const listCurrency = userInfo?.currencys;
  const currencyData = listCurrency?.find((item) => item.id === currency);
  const formatListCurrency = listCurrency?.map((item) => {
    return {
      value: item.id,
      label: item.currency_symbol,
    };
  });

  return mode === "edit" ? (
    <div className="field-edit-group field-ajax-currencypicklist">
      <div>
        <FormItem name={`currency_${fieldId}`} initialValue={currency || formatListCurrency[0]}>
          <RenderSelectCurrency formatListCurrency={formatListCurrency} />
        </FormItem>
      </div>
      <Input
        id={id}
        className="field-edit-input"
        type="numbers"
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        autoFocus={autoFocus}
        onChange={onChange}
        value={value}
        disabled={disabled}
      />
    </div>
  ) : (
    <>
      <div className="field-currencypicklist-container">
        <span className="icon-value">{currencyData?.currency_symbol}</span>
        {valueFormat}
      </div>
    </>
  );
}

const RenderSelectCurrency = memo((props) => {
  const { formatListCurrency, onChange, value } = props;

  return (
    <Select
      size="large"
      allowClear={false}
      popupClassName="app-select-popup"
      defaultActiveFirstOption={true}
      customoptions={formatListCurrency}
      popupMatchSelectWidth={false}
      value={value}
      onChange={onChange}
      type="module"
    />
  );
});

export default memo(CurrencyPicklist);
