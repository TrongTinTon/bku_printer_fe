import React, { forwardRef, useRef } from "react";
import Select from "src/components/Form/Select";
import Input from "src/components/Form/Input";

const RenderFilterInput = forwardRef((props, ref) => {
  const { fieldType, columnInfo, userInfo, onChange, value } = props;

  const valueSelectRef = useRef(null);

  const renderValueWithFieldType = () => {
    const selectProps = {
      selectref: valueSelectRef,
      classcustom: "input-value",
      size: "large",
      mode: "multiple",
      allowClear: false,
      showSearch: true,
      closeafterselect: "true",
    };

    switch (fieldType) {
      case "picklist":
        const optionsPicklist = columnInfo?.type?.picklistValues;
        const hasEmpty = optionsPicklist?.find((item) => item.value === "");
        !hasEmpty && optionsPicklist.push({ label: "Trống", value: "" });
        return <Select {...selectProps} customoptions={optionsPicklist} onChange={onChange} value={value || []} />;
      case "owner":
        const optionsOwner = [
          { label: "Người dùng", options: userInfo?.users },
          { label: "Nhóm", options: userInfo?.groups },
        ];

        return (
          <Select {...selectProps} type="owner" customoptions={optionsOwner} onChange={onChange} value={value || []} />
        );

      default:
        return (
          <Input
            ref={ref}
            className={"input-value"}
            allowClear
            size="large"
            placeholder="Tìm kiếm"
            onChange={onChange}
            value={value}
          />
        );
    }
  };
  return renderValueWithFieldType();
});

export default RenderFilterInput;
