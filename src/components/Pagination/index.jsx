import React from "react";
import { Pagination as PaginationAntd } from "antd";
import "./style.scss";

function Pagination(props) {
  return <PaginationAntd className="pagination-custom" {...props} />;
}

export default Pagination;
