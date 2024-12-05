import React, { memo, useRef, useEffect } from "react";
import Input from "src/components/Form/Input";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import "../style.scss";

function Comment(props) {
  const { value, mode, autoFocus } = props;

  const commentRef = useRef(null);

  useEffect(() => {
    if (mode === "edit" && autoFocus) {
      commentRef.current?.focus({ cursor: "end" });
    }
  }, [mode]);

  return mode === "edit" ? (
    <div className="field-edit-group">
      <Input
        ref={commentRef}
        className="field-edit-input field-comment-input"
        type="textarea"
        autoSize={{ minRows: 1, maxRows: 10 }}
        {...props}
      />
    </div>
  ) : (
    <div className="field-detail-container field-comment">
      {!value && <FaIcon icon={"fa-regular fa-comments"} color="#b3beca" />}
      <span>{value}</span>
    </div>
  );
}

export default memo(Comment);
