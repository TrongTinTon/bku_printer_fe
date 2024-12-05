/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import Input from "src/components/Form/Input";

function RenderTitle({ data, shadow, isEditTitle, setIsEditTitle, updateColumnData }) {
  const inputTitleRef = useRef(null);
  const defaultTitle = useRef(data?.label);
  const isEditable = data?.isEditable;

  const [value, setValue] = useState(defaultTitle?.current);

  useEffect(() => {
    const handleClickOutside = async (e) => {
      if (!inputTitleRef.current?.input?.contains(e.target)) {
        handleOnBlur();
      }
    };

    if (isEditTitle) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [value, isEditTitle]);

  const handleEditTitle = (e) => {
    if (shadow || !isEditable) return;
    setTimeout(() => {
      inputTitleRef.current?.focus();
      inputTitleRef.current?.select();
    }, 10);
    setIsEditTitle(true);
  };

  const handleOnChange = (e) => {
    setValue(e.target.value);
  };

  const handleOnBlur = (e) => {
    const isChangeTitle = value !== defaultTitle.current;
    if (isChangeTitle && value) {
      updateColumnData("updated", { value: { projecttaskname: value }, recordId: data?.key });
      defaultTitle.current = value;
    }
    !value && setValue(defaultTitle.current);
    setIsEditTitle(false);
  };

  return (
    <>
      {!isEditTitle ? (
        <div className={`header-title ${isEditable && "editable"}`} onMouseUp={handleEditTitle}>
          <span>{value}</span>
          <FaIcon className="icon-edit" icon="fa-marker" fontSize={12} />
        </div>
      ) : (
        <Input
          ref={inputTitleRef}
          className="input-header-title"
          size="large"
          value={value}
          status={!value && "error"}
          onChange={handleOnChange}
          onPressEnter={handleOnBlur}
        />
      )}
    </>
  );
}

export default RenderTitle;
