import React, { memo, useCallback, useState } from "react";
import { Modal, Radio, Checkbox, Tooltip } from "antd";
import Avatar from "src/components/Avatar";
import Input from "src/components/Form/Input";
import { List, AutoSizer } from "react-virtualized";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import appGlobal from "src/global/AppGlobal";
import _debounce from "lodash/debounce";
import "./style.scss";
import { floor } from "lodash";

function MultiOwner(props) {
  const { id, value, mode, suffixIcon, disabled, autoFocus, fieldInfo } = props;

  const [isOpenModal, setIsOpenModal] = useState((false && !disabled) || autoFocus);

  // Tính toán số lượng hiển thị dựa vào chiều rộng của field
  const fieldValueElement = document.getElementById(`${fieldInfo?.name}Value`);
  const minus = mode === "edit" ? 193 : 50;
  const maxCount = floor((fieldValueElement?.offsetWidth - minus) / 30) || 10;

  const onOpenModal = () => {
    setIsOpenModal(true);
  };

  const onCloseModal = () => {
    setIsOpenModal(false);
  };

  const renderContent = (icon = true) => (
    <>
      <div id={id} className="field-multiowner-container">
        <Avatar listUsers={value} maxCount={maxCount} size={30} {...props} />
      </div>
      {suffixIcon && icon && <FaIcon className="icon-value" icon={suffixIcon} />}
    </>
  );

  const renderEditContent = () => (
    <>
      <div id={id} className="field-edit-group" onClick={onOpenModal}>
        <div className={`field-edit-input ${disabled ? " disabled" : ""}`}>{renderContent(false)}</div>
        <div className="suffix-icon">
          <FaIcon icon={suffixIcon} color="#A0AEC0" />
        </div>
      </div>
      {!disabled && <RenderModalEdit isOpenModal={isOpenModal} onCloseModal={onCloseModal} {...props} />}
    </>
  );

  return <>{mode === "edit" ? renderEditContent() : renderContent()}</>;
}

const RenderModalEdit = memo((props) => {
  const { id, value, onChange, fieldInfo, userInfo, onFinish, isOpenModal, onCloseModal, onCancel } = props;

  const users = userInfo?.users || [];

  const [userSelected, setUserSelected] = useState(value || []);
  const [listUsers, setListUsers] = useState(users);

  const isChange = JSON.stringify(value) !== JSON.stringify(userSelected);
  const bodyHeight = window.innerHeight * 0.6;
  const isShowSelectAll = userSelected?.length >= 5 && userSelected?.length < users?.length;

  const onCheckOwner = (e, owner) => {
    const valueCheck = e.target.value;

    const isExist = userSelected?.some((item) => +item?.value === +owner?.value);

    const newValue = valueCheck
      ? isExist
        ? userSelected?.map((item) => (+item?.value === +owner?.value ? { ...owner, permission: valueCheck } : item))
        : [...userSelected, { ...owner, permission: valueCheck }]
      : userSelected?.filter((item) => +item?.value !== +owner?.value);

    setUserSelected(newValue);
  };

  const onSelected = (owner) => {
    const isExist = userSelected?.some((item) => +item?.value === +owner?.value);
    const newValue = isExist
      ? userSelected?.filter((item) => +item?.value !== +owner?.value)
      : [...userSelected, { ...owner, permission: "read" }];
    setUserSelected(newValue);
  };

  const onRemoveSelect = (owner) => {
    const newValue = userSelected?.filter((item) => +item?.value !== +owner?.value);
    setUserSelected(newValue);
  };

  const onSaveOwner = () => {
    const dataFinish = { smmultiownerid: userSelected };
    if (!isChange) return;

    onChange(userSelected);
    onFinish && onFinish(dataFinish);
    onCloseModal();
  };

  const onCancelOwner = () => {
    if (onCancel) {
      onCancel();
    } else {
      setUserSelected([]);
      onCloseModal();
    }
  };

  const onSearchOwner = useCallback(
    _debounce((e) => {
      const value = e.target.value;
      const listSearch = users?.filter((item) => {
        const label = appGlobal.removeVNAccents(item?.label?.toLowerCase());
        const valueSearch = appGlobal.removeVNAccents(value?.toLowerCase());
        return label?.includes(valueSearch);
      });
      setListUsers(listSearch);
    }, 130),
    []
  );

  const onSelectAll = () => {
    const newValue =
      userSelected?.length < users?.length ? users?.map((item) => ({ ...item, permission: "read" })) : [];
    setUserSelected(newValue);
  };

  const handleScrollList = useCallback(
    ({ clientHeight, scrollHeight, scrollTop }) => {
      const isEndScroll = scrollHeight - (clientHeight + scrollTop) <= 20;
      const btnSelectAll = document.querySelector(".btn-select-all");
      if (!isShowSelectAll) return;

      if (isEndScroll) {
        btnSelectAll?.style?.setProperty("transform", "translateY(40px)");
      } else {
        btnSelectAll?.style?.setProperty("transform", "translateY(0px)");
      }
    },
    [isShowSelectAll]
  );

  return (
    <Modal
      open={isOpenModal}
      closeIcon={false}
      className="multiowner-edit-modal"
      centered={true}
      destroyOnClose={true}
      okText="Lưu"
      okButtonProps={{ className: `btn-save ${!isChange && "disabled"}` }}
      cancelText="Hủy"
      cancelButtonProps={{ className: "btn-cancel" }}
      onOk={onSaveOwner}
      onCancel={onCancelOwner}
      zIndex={1500}>
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <div className="group-title">
            <div className="modal-title">{fieldInfo?.label || "Chia sẻ"}</div>
            <div className="modal-close" onClick={onCancelOwner}>
              <FaIcon icon="fa-xmark" />
            </div>
          </div>
          <div className="group-search">
            {/* <div className="btn-filter">
              <FaIcon icon="fa-filter" />
              <span>Lọc</span>
            </div> */}
            <Input
              id={`search-multiowner-${id}`}
              className="search-multiowner"
              placeholder="Tìm kiếm"
              type="search"
              size="large"
              allowClear={true}
              onChange={onSearchOwner}
            />
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* List owners */}
          <div className="list-owner">
            <AutoSizer disableHeight>
              {({ width, height }) => (
                <List
                  data={listUsers}
                  rowCount={listUsers?.length}
                  overscanRowCount={10}
                  width={width}
                  height={bodyHeight}
                  rowHeight={50}
                  onScroll={handleScrollList}
                  rowRenderer={({ index, isScrolling, key, style }) => (
                    <RenderItemOwner
                      id={index}
                      key={key}
                      userSelected={userSelected}
                      data={listUsers[index]}
                      onSelected={onSelected}
                      onCheckOwner={onCheckOwner}
                      style={style}
                    />
                  )}
                />
              )}
            </AutoSizer>
            <div
              style={{ transform: isShowSelectAll ? "translateY(0px)" : "translateY(40px)" }}
              className="btn-select-all">
              <span onClick={onSelectAll}>Chọn tất cả</span>
            </div>
          </div>

          {/* List selected */}
          <RenderListSelected
            userSelected={userSelected}
            onRemoveSelect={onRemoveSelect}
            users={users}
            userInfo={userInfo}
          />
        </div>
      </div>
    </Modal>
  );
});

const RenderItemOwner = ({ id, userSelected, data, onSelected, onCheckOwner, style }) => {
  const imgSrc = data?.imgUrl || "layouts/v7/skins/images/defautAvatar.png";
  const userSelect = userSelected?.find((item) => +item?.value === +data?.value) || "";

  return (
    <div style={style} className="owner-item">
      <div className="group-left" onClick={() => onSelected(data)}>
        <Checkbox id={`checkbox-${id}`} checked={userSelect} className="owner-checkbox" />
        <img className="owner-img" src={`https://quocduygroup.com/vtiger/${imgSrc}`} />
        <span className="owner-name">{data?.label}</span>
      </div>
      <div className="group-right">
        <Radio.Group
          defaultValue=""
          buttonStyle="solid"
          value={userSelect?.permission}
          onChange={(e) => onCheckOwner(e, data)}>
          <Radio.Button id={`read-${id}`} value="read">
            Đọc
          </Radio.Button>
          <Radio.Button id={`write-${id}`} value="write">
            Ghi
          </Radio.Button>
        </Radio.Group>
      </div>
    </div>
  );
};

const RenderListSelected = ({ userSelected, onRemoveSelect, users, userInfo }) => {
  return (
    <div className="list-select">
      <div className="list-select-title">
        Đã chọn
        <span className="bage">
          ({userSelected?.length}/{users?.length})
        </span>
      </div>
      <div className="list-select-content">
        {userSelected?.map((item, index) => {
          const imgSrc = item?.imgUrl || "layouts/v7/skins/images/defautAvatar.png";
          const isLeaved = !users?.some((user) => +user?.value === +item?.value);
          const isOwner = +item?.value === +userInfo?.id;
          return (
            <div className={`list-select-item ${isLeaved ? "is-leaved" : ""}`} key={index}>
              <div className="item-left">
                <img className="owner-img" src={`https://quocduygroup.com/vtiger/${imgSrc}`} />
                <span className="owner-name">{item?.label}</span>
                {isLeaved && (
                  <Tooltip title={"Đã thôi việc"} zIndex={2500}>
                    <FaIcon icon="fa-info-circle" color="#A0AEC0" />
                  </Tooltip>
                )}
                {isOwner && <FaIcon icon="fa-star" color="#FFC107" />}
              </div>
              <div className="item-right">
                <div className="btn-remove" onClick={() => onRemoveSelect(item)}>
                  <FaIcon icon="fa-circle-xmark" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(MultiOwner);
