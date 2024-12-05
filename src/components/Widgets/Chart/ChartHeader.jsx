/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { Modal, Select } from "antd";
import NoResult from "../../NoResult";
import appGlobal from "../../../global/AppGlobal";

function ChartHeader(props) {
  const {
    title,
    showTimeNow,
    selectOption,
    dashboard,
    handlReLoad,
    bodyApi,
    contentDetail,
    showTimeContent,
    modalStyle,
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectValue, setSelectValue] = useState("Tất cả");

  useEffect(() => {
    selectValue !== "Tất cả" && setSelectValue("Tất cả");
  }, [dashboard]);

  const handlChangeSelect = (value) => {
    handlReLoad({ filterBy: value === "Tất cả" ? "" : value, ...bodyApi });
    setSelectValue(value);
  };

  const handleOpenDetail = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const ContentBody = contentDetail;

  return (
    <>
      <div className="title-group">
        <span className="title">{title}</span>
        <div className="button-group">
          {showTimeNow && (
            <span className="note-title">
              {typeof showTimeNow === "string" ? showTimeNow : `Số liệu tính đến: ${appGlobal.getTimeNow()}`}
            </span>
          )}
          {selectOption && (
            <Select
              defaultValue="Tất cả"
              value={selectValue}
              className="select-title-chart"
              popupClassName="select-option-chart"
              suffixIcon={<FaIcon color="#A0AEC0" fontSize={14} icon="fa-angle-down" />}
              options={selectOption}
              onChange={handlChangeSelect}
              placement={"bottomRight"}
            />
          )}
          {contentDetail && (
            <span className="button" onClick={handleOpenDetail}>
              <FaIcon color="#A0AEC0" fontSize={16} icon="fa-expand" />
            </span>
          )}
        </div>
      </div>

      <Modal
        title={`${title} ${showTimeContent ? `(${dashboard?.timeNow.label})` : ""}`}
        open={isModalOpen}
        footer={null}
        destroyOnClose={true}
        onCancel={handleCancel}
        centered={true}
        width={"80%"}
        closeIcon={<FaIcon fontSize={24} icon="fa-xmark" />}
        wrapClassName={"chart-modal-detail"}
        {...modalStyle}
      >
        {contentDetail ? (
          <ContentBody {...props} />
        ) : (
          <div className="empty-content">
            <NoResult width={180} />
          </div>
        )}
      </Modal>
    </>
  );
}

export default ChartHeader;
