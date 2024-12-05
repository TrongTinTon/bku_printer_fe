import React, { useRef, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListLabelModule } from "src/store/module/actions";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { Modal, Tooltip, ConfigProvider } from "antd";
import Select from "../Select";
import RenderModalSelect from "./RenderModalSelect";
import debounce from "lodash/debounce";
import "./style.scss";

function Reference(props) {
  const dispatch = useDispatch();

  const {
    id,
    field,
    module,
    value,
    onChange,
    showSelectModule = true,
    disabled,
    autoFocus,
    iconSearch,
    customOption,
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [optionDatas, setOptionDatas] = useState([]);

  const moduleList = useSelector((state) => state.module.moduleLists);

  // Module parent
  const moduleInfo = moduleList.find((item) => item.name === module);
  const fieldInfo = moduleInfo?.fields?.find((item) => item.column === field || item.name === field);
  const fieldType = fieldInfo ? fieldInfo?.type?.name : null;
  const refersToModule = fieldInfo?.type.refersTo;

  const convertRefersToOption = () => {
    return (
      refersToModule
        ?.map((item) => {
          const moduleRefInfo = moduleList.find((module) => module.name === item);
          const label = moduleRefInfo?.label;
          const listviewable = moduleRefInfo?.permission.listViewable;
          const cvid = moduleRefInfo?.listviews?.[0]?.cvid;
          return listviewable
            ? {
                label: label,
                value: item,
                cvid: cvid,
                listviews: moduleRefInfo?.listviews[0],
              }
            : null;
        })
        .filter(Boolean) || []
    );
  };

  // Module select
  const moduleSelect = useRef(
    value?.module ? { value: value.module?.name, label: value.module?.label } : convertRefersToOption()[0]
  );

  const moduleSelectInfo = moduleList.find((item) => item.name === moduleSelect.current?.value);
  const moduleSelectLabel = moduleSelectInfo?.label;
  const permissionModuleSelect = moduleSelectInfo?.permission;

  const fetchOptions = async (textSearch) => {
    const result = await await dispatch(
      getListLabelModule({ module: moduleSelect.current?.value, searchtext: textSearch })
    );
    if (result) {
      setOptionDatas(result);
    }
  };

  const onSearch = useMemo(() => {
    if (!permissionModuleSelect?.listViewable) return;
    const loadOptions = (value) => {
      if (value !== "" && value.length > 1) {
        fetchOptions(value);
      } else {
        setOptionDatas([]);
      }
    };
    return debounce(loadOptions, 250);
  }, []);

  const onChangeModule = (value) => {
    moduleSelect.current = value;
    setOptionDatas([]);
    onChange({ value: null, module: value?.value });
  };

  const onChangeValue = (value, option) => {
    const returnOption = { ...value, moduleName: moduleSelectLabel, module: moduleSelect.current?.value };
    onChange && onChange(returnOption);
  };

  const handleOpenModal = () => {
    !props?.disabled && setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          motionDurationSlow: "0.15s",
          motionDurationMid: "0.15s",
        },
      }}>
      <div className={`related-value-group ${props?.className}`}>
        {fieldType === "multireference" && showSelectModule && (
          <div className="module">
            <Select
              size="large"
              allowClear={false}
              popupClassName="app-select-popup"
              value={moduleSelect.current}
              defaultActiveFirstOption={true}
              customoptions={convertRefersToOption()}
              onChange={onChangeModule}
              disabled={props?.disabled}
              popupMatchSelectWidth={false}
              valuereturn={"object"}
              type="module"
            />
            {!moduleSelectLabel && (
              <Tooltip title="Module không có quyền xem" zIndex={2000}>
                <div className="note-error">
                  <FaIcon icon="fa-circle-exclamation" color="#F63A46" />
                </div>
              </Tooltip>
            )}
          </div>
        )}
        <div className="value">
          <Select
            id={id}
            allowClear={value?.value ? props?.allowClear : false}
            filterOption={false}
            autoFocus={autoFocus}
            disabled={disabled}
            size="large"
            options={customOption ? false : optionDatas}
            customoptions={customOption ? optionDatas : null}
            onSearch={onSearch}
            showSearch={permissionModuleSelect?.listViewable}
            suffixIcon={<></>}
            notFoundContent={null}
            value={value}
            onChange={onChangeValue}
            optionLabelProp="title"
            valuereturn="object"
            type={field}
          />
          <div className="btn-search" onClick={handleOpenModal}>
            {iconSearch ? iconSearch : <FaIcon icon="fa-magnifying-glass" />}
          </div>
        </div>
      </div>

      {!props?.disabled && (
        <Modal
          title={null}
          centered
          open={isModalOpen}
          footer={null}
          onCancel={handleCloseModal}
          destroyOnClose={true}
          closeIcon={false}
          wrapClassName={`reference-modal ${field}`}
          width={"87%"}>
          <RenderModalSelect
            isModalOpen={isModalOpen}
            moduleSelect={moduleSelect}
            onSelect={onChange}
            handleCloseModal={handleCloseModal}
            moduleList={moduleList}
            listModuleSelect={convertRefersToOption()}
            showSelectModule={showSelectModule}
          />
        </Modal>
      )}
    </ConfigProvider>
  );
}

export default Reference;
