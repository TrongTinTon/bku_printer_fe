/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, Suspense, useState, memo, useCallback } from "react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { Button, Tooltip, Form, App as AntdApp, Anchor, Collapse } from "antd";
import Input from "src/components/Form/Input";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getRecord, getCountRelatedRecord, saveRecord } from "src/store/module/actions";
import appGlobal from "src/global/AppGlobal";
import ServerUrl from "src/constants/ServerUrl";
import RenderFieldWithType from "./RenderFieldWithType";

function RenderModal(props) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { modal, message, notification } = AntdApp.useApp();
  const { module, recordId, onCloseModal, tabsList } = props;

  const configDetailView = JSON.parse(localStorage.getItem("configDetailView")) || {};
  const defaultActiveTab = configDetailView?.[module?.name]?.activeTab || "0";
  const moduleLists = useSelector((state) => state.module.moduleLists);
  const moduleInfo = moduleLists?.find((item) => item?.name === module?.name);
  const userInfo = appGlobal.GetUserInfo();

  const blocks = moduleInfo?.blocks || [];
  const blocksFilter = blocks?.filter((item) => item?.display_status === "1" && item?.value !== "LBL_ITEM_DETAILS");

  // useEffect(() => {
  //   if (recordId) {
  //     defaultActiveTab !== "0" && fetchDataRecord(recordId);
  //   } else {
  //     onCloseModal();
  //   }
  // }, [recordId]);

  // Fetch data
  // const fetchDataRecord = async (record) => {
  //   const result = await dispatch(getRecord({ module: module.name, record: record }));
  //   if (result) {
  //     console.log(result);
  //     recordData.current = result;
  //     headerLeftRef.current?.setData(result);
  //     headerRightRef.current?.setData(result);
  //   } else {
  //     modal.confirm({
  //       className: "arlert-no-permission",
  //       title: "Không có quyền truy cập!",
  //       content: "Bạn không có quyền truy cập vào nội dung này!",
  //       okText: "Trang chủ",
  //       cancelText: "Quay lại",
  //       autoFocusButton: null,
  //       onCancel: () => {
  //         onCloseModal();
  //       },

  //       onOk: () => {
  //         navigate("/");
  //       },
  //     });
  //   }
  //   return result;
  // };

  const onFinish = async (values) => {
    console.log(values);
  };

  const getFieldInfo = useCallback(
    (fieldName) => {
      const fieldsModule = moduleInfo?.fields || [];
      const fieldInfo = fieldsModule?.find((item) => item?.name === fieldName);
      return fieldInfo;
    },
    [moduleInfo]
  );

  const onClickAnchor = (e, link) => {
    e.preventDefault();
  };

  const getBlockItems = () => {
    return (blocksFilter || [])
      .map(({ id, label, fields }, index) => {
        const key = String(index);
        const displayHasShow = ["1"];
        const fieldFilter = fields?.filter(({ displaytype }) => displayHasShow?.includes(displaytype));

        return (
          fieldFilter?.length > 0 && {
            key,
            id: `block-edit-${id}`,
            label: <span>{label}</span>,
            children: fieldFilter.length > 0 && (
              <RenderBlockFields fields={fields} module={module} getFieldInfo={getFieldInfo} userInfo={userInfo} />
            ),
            className: "collapse-custom-item",
          }
        );
      })
      .filter(Boolean);
  };

  const getAnchorItems = () => {
    return (blocks || [])
      ?.filter((block) => block?.display_status === "1")
      ?.map((item, index) => {
        const { id, label, fields, value } = item;
        const key = String(index);
        const displayHasShow = ["1", "2"];
        const fieldFilter = fields?.filter(({ displaytype }) => displayHasShow?.includes(displaytype));

        return (
          (fieldFilter?.length > 0 || value === "LBL_ITEM_DETAILS") && {
            key,
            href: `#block-edit-${id}`,
            title: label,
          }
        );
      })
      .filter(Boolean);
  };

  const propsHeader = {
    module: module,
    recordId: recordId,
    onCloseModal: onCloseModal,
  };

  return (
    <Form form={form} name={`edit-${recordId}`} className="edit-form" onFinish={onFinish}>
      <div className="modal-container">
        <div className="modal-header">
          <RenderHeader {...propsHeader} />
        </div>

        <div className="modal-body">
          <div className="content-header" />

          <div className="content-container">
            <div className="collapse-edit-content">
              <Collapse
                items={getBlockItems()}
                expandIcon={({ isActive }) => (
                  <FaIcon icon={"fa-chevron-down"} className={`arrow-collapse ${isActive ? "arrow-active" : ""}`} />
                )}
                defaultActiveKey={getBlockItems()?.map((item) => item.key)}
                bordered={false}
                className="collapse-custom"
              />
            </div>

            <div className="anchor-edit-content">
              <Anchor
                targetOffset={200}
                getContainer={() => document.querySelector(".edit-modal-app .modal-body")}
                onClick={onClickAnchor}
                items={getAnchorItems()}
                className="anchor-custom"
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="btn-group">
            <Button className="btn-save" type="primary" htmlType="submit">
              <span>Lưu</span>
            </Button>
            <Button className="btn-cancel" onClick={onCloseModal}>
              <span>Hủy</span>
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
}

const RenderHeader = ({ module, recordId, onCloseModal }) => {
  const iconModuleSrc = `${ServerUrl.urlSub}assets/icon/${module?.name}.svg`;

  return (
    <>
      {/* Header left */}
      <div className="header-left">
        <img src={iconModuleSrc} alt={module} height={22} width={22} />
        <div className="title">
          <span>{recordId ? "Chỉnh sửa" : "Tạo mới"} - </span>
          {recordId}
        </div>
      </div>

      {/* Header right */}
      <div className="header-right">
        <Input className="input-search" allowClear type="search" size="large" placeholder="Tìm trường" />
        <div className="btn-close" onClick={onCloseModal}>
          <FaIcon icon="fa-xmark" />
        </div>
      </div>
    </>
  );
};

const RenderBlockFields = ({ fields, getFieldInfo, userInfo, module }) => {
  return (
    <div className="block-container">
      <div className="block-row">
        {fields?.map((field, index) => {
          const fieldName = field?.name;
          const fieldLabel = field?.label;
          const displayType = field?.displaytype;
          const fieldInfo = getFieldInfo(fieldName);
          const editable = fieldInfo?.editable && displayType === "1";
          const mandatory = fieldInfo?.mandatory;

          return (
            editable && (
              <div key={index} className="group-field">
                <div className="item-label">
                  <span>
                    {mandatory && <span className="icon-required">*</span>} {fieldLabel}
                  </span>
                </div>
                <div className="group-item-value">
                  <RenderFieldWithType module={module} fieldInfo={fieldInfo} userInfo={userInfo} />
                </div>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};

export default memo(RenderModal);
