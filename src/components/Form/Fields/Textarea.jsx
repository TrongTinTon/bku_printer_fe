import React, { memo, useEffect, useRef } from "react";
import Input from "src/components/Form/Input";
import "./style.scss";

function Textarea(props) {
  const { value, mode, autoFocus } = props;
  const textareaRef = useRef(null);

  useEffect(() => {
    if (mode === "edit" && autoFocus) {
      textareaRef.current?.focus({ cursor: "end" });
    }
  }, [mode]);

  return mode === "edit" ? (
    <div className="field-edit-group">
      <Input
        ref={textareaRef}
        className="field-edit-input ajax-textarea"
        type="textarea"
        autoSize={{ minRows: 3, maxRows: 10 }}
        {...props}
      />
    </div>
  ) : (
    <>
      <div className="field-textarea-container">{value}</div>
    </>
  );
}

export default memo(Textarea);
