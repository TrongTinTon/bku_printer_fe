import React, { useLayoutEffect, useState } from "react";
import Input from "src/components/Form/Input";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { LoadingOutlined } from "@ant-design/icons";
import { unstable_batchedUpdates } from "react-dom";
import { Spin } from "antd";

function AddColumn(props) {
  const { updateColumnData, containers } = props;
  const [inputName, setInputName] = useState("");
  const [isSaving, setSaving] = useState(false);

  const handleAddColumn = () => {
    const btnAddColumn = document.querySelector(".btn-add-kanban-column");
    const formAddColumn = document.querySelector(".form-add-kanban-column");
    const inputName = document.querySelector(".input-name-column");
    btnAddColumn.classList.add("hide");
    formAddColumn.classList.remove("hide");
    inputName.focus();

    // onclick outside form
    const handleClickOutside = (e) => {
      if (formAddColumn && !formAddColumn.contains(e.target)) {
        btnAddColumn.classList.remove("hide");
        formAddColumn.classList.add("hide");
        setInputName("");
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  };

  const onSaveColumn = () => {
    if (inputName.length === 0 || isSaving) return;
    setSaving(true);
    const values = {
      value: {
        projecttaskname: inputName,
        cf_sortorder: containers.length + 1,
      },
    };
    const saveData = updateColumnData("created", values);
    saveData.then((res) => {
      unstable_batchedUpdates(() => {
        setSaving(false);
        setInputName("");
      });

      const inputName = document.querySelector(".input-name-column");
      const kanbanBody = document.querySelector(".kanban-body");
      // scroll to end horizontal
      setTimeout(() => {
        kanbanBody.scrollLeft = kanbanBody.scrollWidth;
        inputName.focus();
      }, 50);
    });
  };

  const onInputChange = (e) => {
    setInputName(e.target.value);
  };

  return (
    <>
      <div onClick={handleAddColumn} className="btn-add-kanban-column">
        <FaIcon icon="fa-plus" />
        <span>Thêm hạn mục</span>
      </div>
      <div className="form-add-kanban-column hide">
        <Input
          className="input-name-column"
          placeholder="Nhập tên hạn mục"
          size="large"
          value={inputName}
          onChange={onInputChange}
          onPressEnter={onSaveColumn}
          disabled={isSaving}
        />
        <div className={`btn-save-column ${(inputName.length === 0 || isSaving) && "disabled"}`} onClick={onSaveColumn}>
          {isSaving ? (
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          ) : (
            <FaIcon icon="fa-check" fontSize={16} />
          )}
        </div>
      </div>
    </>
  );
}

export default AddColumn;
