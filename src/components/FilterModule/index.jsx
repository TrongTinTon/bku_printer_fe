/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import Input from "src/components/Form/Input";
import Select from "src/components/Form/Select";
import { ConditionFilter } from "../../constants/ConditionFilter";
import RenderFilterInput from "./RenderFilterInput";
import { List, AutoSizer } from "react-virtualized";
import { Button, Checkbox, Form } from "antd";
import appGlobal from "../../global/AppGlobal";
import "./style.scss";

const fieldNotShow = ["id", "tags", "starred"];

function FilterModule(props) {
  const { moduleInfo, onCloseDropdown, initValueFilter = [], onSubmit } = props;

  const userInfo = appGlobal.GetUserInfo();
  const [form] = Form.useForm();

  const module = moduleInfo?.name || "";
  const moduleLabel = moduleInfo?.label || "";
  const moduleFields = moduleInfo?.fields || [];
  const newModuleFields = moduleFields.filter((field) => !fieldNotShow.includes(field?.name));
  const listInputRef = useRef({});
  const listFieldsRef = useRef(null);
  const listFields = useRef(newModuleFields);
  const filterBodyHeight = window.innerHeight - 370;

  const [filters, setFilters] = useState(initValueFilter);

  useEffect(() => {
    setTimeout(() => {
      handleCheckSubmit();
    }, 20);

    if (filters.length === 0) {
      form.resetFields();
    }
  }, [filters]);

  useEffect(() => {
    if (listFieldsRef.current) {
      listFieldsRef.current.recomputeRowHeights();
    }
  }, [listFields.current]);

  useEffect(() => {
    handleSortListField();
  }, [moduleFields]);

  const handleSortListField = () => {
    const listFieldSort = [];
    const filterSet = new Set(filters.map((filter) => filter.name));
    console.log(newModuleFields);
    newModuleFields?.forEach((field) => {
      if (filterSet.has(field.column)) {
        field ? (field["height"] = 138) : null;
        listFieldSort.unshift(field);
      } else {
        field ? (field["height"] = 38) : null;
        listFieldSort.push(field);
      }
    });

    listFields.current = listFieldSort;
  };

  const handleSearchListField = (value) => {
    const normalizedSearchValue = appGlobal.removeVNAccents(value).toLowerCase();

    const searchFields = newModuleFields?.filter((item) => {
      const normalizedLabel = appGlobal.removeVNAccents(item?.label).toLowerCase();
      return normalizedLabel.includes(normalizedSearchValue);
    });

    newModuleFields?.forEach((field) => {
      const inSearch = searchFields.find((item) => item.column === field.column);
      const fieldElement = document.querySelector(`#id_${field.name}`);
      if (inSearch) {
        fieldElement ? (fieldElement.style.display = "") : null;
      } else {
        fieldElement ? (fieldElement.style.display = "none") : null;
      }
    });
  };

  const addFieldHeight = (fieldName, height) => {
    const listFieldSort = listFields.current.map((field) => {
      if (field.column === fieldName) {
        field.height = height;
      }
      return field;
    });

    listFields.current = listFieldSort;
  };

  const onActiveField = async (e, item) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      // add field height
      await addFieldHeight(item?.column, 138);

      setFilters([...filters, { name: item?.column }]);
      setTimeout(() => {
        const inputRef = listInputRef[`${item?.column}`];
        inputRef ? inputRef.focus() : null;
      }, 20);
    } else {
      // remove field height
      await addFieldHeight(item?.column, 38);

      setFilters(filters.filter((filter) => filter.name !== item?.column));
      if (initValueFilter?.length > 0 && filters?.length === 1) {
        onConfirmFilter([], false);
      }
    }
  };

  const handleCheckSubmit = () => {
    const allFields = form.getFieldsValue();
    const allFieldsValue = Object.keys(allFields).map((key) => {
      return allFields[key];
    });

    const btnSubmit = document.querySelector(".btn-submit");
    const btnReset = document.querySelector(".btn-cancel");
    const hasEmptyValue = allFieldsValue.length > 0 ? allFieldsValue?.some((item) => item === "") : true;

    if (hasEmptyValue) {
      btnSubmit ? (btnSubmit.disabled = true) : null;
    } else {
      btnSubmit ? (btnSubmit.disabled = false) : null;
    }

    if (filters.length === 0 || initValueFilter?.length === 0) {
      btnReset ? (btnReset.disabled = true) : null;
    }
  };

  const onResetFilter = () => {
    if (initValueFilter?.length === 0) return;
    setFilters([]);
    onSubmit([]);
    onPressBackground();
  };

  const onConfirmFilter = (values, closeModal = true) => {
    const mergedValues = Object.entries(values).reduce((acc, [key, value]) => {
      const [name, type] = key.split("||");
      const existing = acc.find((item) => item.name === name);

      if (existing) {
        existing[type] = value;
      } else {
        acc.push({ name, [type]: value });
      }

      return acc;
    }, []);

    onSubmit(mergedValues);
    closeModal && onCloseDropdown();
  };

  const onFieldsChange = (changedFields, allFields) => {
    handleCheckSubmit();
  };

  const onPressBackground = () => {
    onCloseDropdown();
  };

  const renderFilterItem = ({ index, isScrolling, key, style }) => {
    const item = listFields.current[index];
    const fieldType = item?.type?.name;
    const condition = ConditionFilter(fieldType);
    const isShow = filters.find((filter) => filter.name === item?.column);
    const initItem = initValueFilter?.find((filter) => filter.name === item?.column);
    const defaultCondition = initItem?.operator || condition?.operatorDefault;
    const defaultInputValue = initItem?.value || "";
    const isHideInput = defaultCondition === "empty" || defaultCondition === "not empty";
    return (
      <div className="filter-item" key={key} id={`id_${item.name}`} style={style}>
        <Checkbox checked={isShow ? true : false} className="check-filter" onChange={(e) => onActiveField(e, item)}>
          <div className="filter-label">{item.label}</div>
        </Checkbox>

        {isShow && (
          <div className="option-filter">
            <Form.Item name={`${item?.column}||operator`} initialValue={defaultCondition}>
              <Select
                className="select-condition-filter"
                size={"large"}
                allowClear={false}
                options={condition?.operator}
              />
            </Form.Item>

            {!isHideInput && (
              <Form.Item shouldUpdate noStyle>
                {({ getFieldValue }) => {
                  const operator = getFieldValue(`${item?.column}||operator`);
                  const isValueEmpty = operator === "empty" || operator === "not empty";
                  return (
                    !isValueEmpty && (
                      <Form.Item name={`${item?.column}||value`} initialValue={defaultInputValue}>
                        <RenderFilterInput
                          ref={(el) => (listInputRef[`${item?.column}`] = el)}
                          fieldType={fieldType}
                          columnInfo={item}
                          userInfo={userInfo}
                        />
                      </Form.Item>
                    )
                  );
                }}
              </Form.Item>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Form
      form={form}
      className="form-filter-module"
      name={`filter-${module}-ref`}
      onFinish={onConfirmFilter}
      onFieldsChange={onFieldsChange}>
      <div className="content-filter-container">
        <div className="filter-header">
          <div className="group-title">
            <span>Lọc {moduleLabel}</span>
            <div className="btn-close" onClick={onCloseDropdown}>
              <FaIcon icon="fa-xmark" />
            </div>
          </div>
          <Input
            placeholder="Tìm kiếm"
            className="search-filter"
            size={"large"}
            allowClear
            onChange={(e) => handleSearchListField(e.target.value)}
          />
        </div>
        <div className="filter-body">
          <AutoSizer disableHeight>
            {({ width, height }) => (
              <List
                ref={listFieldsRef}
                data={listFields.current}
                rowCount={listFields.current?.length}
                overscanRowCount={10}
                width={width}
                height={filterBodyHeight}
                rowHeight={({ index }) => listFields.current[index].height}
                rowRenderer={renderFilterItem}
              />
            )}
          </AutoSizer>
        </div>

        <div className="filter-footer">
          <Button className="btn-cancel" onClick={onResetFilter}>
            Bỏ lọc
          </Button>
          <Button disabled className="btn-submit" htmlType="submit">
            Áp dụng
          </Button>
        </div>
      </div>
      <div className="mask-overlay" onClick={onPressBackground}></div>
    </Form>
  );
}

export default FilterModule;
