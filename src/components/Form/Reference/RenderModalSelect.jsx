/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { App as AntdApp, Spin, Tooltip } from "antd";
import Pagination from "../../Pagination";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { getListModule } from "src/store/module/actions";
import Input from "src/components/Form/Input";
import TableData from "src/components/TableData";
import NoPermission from "../../NoPermission/Index";
import Select from "../Select";

function RenderModalSelect(props) {
  const dispatch = useDispatch();
  const { message } = AntdApp.useApp();

  const { moduleSelect, onSelect, multiSelect, handleCloseModal, moduleList, listModuleSelect, showSelectModule } =
    props;

  const [isLoading, setLoading] = useState(true);

  const moduleSelectInfo = moduleList.find((item) => item.name === moduleSelect.current?.value);
  const listViews = moduleSelectInfo?.listviews;
  const relateListView = listViews?.find((filter) => filter.viewname === "Related list") || listViews?.[0];
  const moduleLabel = moduleSelectInfo?.label || moduleSelect.current?.label;

  const fieldImg = moduleSelectInfo?.fields?.find((field) => field.name === "imagename");
  const permissionModule = moduleSelectInfo?.permission;
  const detailAndSelect = permissionModule?.detailAndSelect;
  const listViewable = permissionModule?.listViewable;

  const contentBodyRef = useRef(null);
  const searchtextRef = useRef(null);
  const listData = useRef([]);
  const totalCount = useRef(0);
  const pageCurrent = useRef(1);
  const orderByCurrent = useRef(null);
  const filterCurrent = useRef([]);
  const searchtext = useRef("");
  const isFirstLoad = useRef(true);

  // Fetch data
  const fetchData = async ({ currentPage, currentOrderby, currentSearchtext, currentFilter, cvid, moduleName }) => {
    const valueSort = currentOrderby?.order === "ascend" ? "ASC" : "DESC";
    const orderby = currentOrderby?.column ? { name: currentOrderby.columnKey, value: valueSort } : "";
    const datas = await dispatch(
      getListModule({
        module: moduleName || moduleSelect.current?.value,
        cvid: cvid || relateListView?.cvid,
        page: currentPage,
        searchtext: currentSearchtext,
        filters: currentFilter?.length > 0 ? currentFilter : "",
        orderby,
      })
    );
    if (datas && datas?.records) {
      listData.current = datas.records;
      totalCount.current = datas.totalCount;
      isFirstLoad.current = isFirstLoad.current && false;

      if (contentBodyRef.current) {
        // Scroll to top
        contentBodyRef.current.scrollTop = 0;
      }
      setLoading(false);
    } else {
      listData.current = [];
      totalCount.current = 0;
      setLoading(false);
    }
  };

  useEffect(() => {
    const config = { currentPage: pageCurrent.current };
    fetchData(config);
    searchtextRef?.current?.focus();
  }, []);

  const updateAndFetchData = (page, searchText, filters, sorter) => {
    pageCurrent.current = page;
    searchtext.current = searchText;
    filterCurrent.current = filters;
    orderByCurrent.current = sorter;
    setLoading(true);
    const config = {
      currentPage: page,
      currentOrderby: sorter,
      currentSearchtext: searchText,
      currentFilter: filters,
    };
    fetchData(config);
  };

  const handleSearch = (value, event) => {
    const trimValue = value.trim();
    if ((!trimValue && trimValue === searchtext.current) || !moduleSelectInfo) return;
    updateAndFetchData(1, trimValue, filterCurrent.current, orderByCurrent.current);
  };

  const handleNextPage = (page, pageSize) => {
    updateAndFetchData(page, searchtext.current, filterCurrent.current, orderByCurrent.current);
  };

  const handleChangeTable = (pagination, filters, sorter) => {
    updateAndFetchData(pageCurrent.current, searchtext.current, filterCurrent.current, sorter);
  };

  const handleSubmitFilter = (values, isRemove) => {
    let updatedFilters = filterCurrent.current || [];
    if (isRemove) {
      updatedFilters = updatedFilters.filter((filter) => filter.name !== values.name);
    } else {
      const existingFilterIndex = updatedFilters.findIndex((filter) => filter.name === values.name);
      existingFilterIndex !== -1 ? (updatedFilters[existingFilterIndex] = values) : updatedFilters.push(values);
    }

    updateAndFetchData(pageCurrent.current, searchtext.current, updatedFilters, orderByCurrent.current);
  };

  const handleClearSortFilter = (e, column) => {
    e.stopPropagation();
    orderByCurrent.current = orderByCurrent.current?.columnKey === column ? null : orderByCurrent.current;
    const updatedFilters = (filterCurrent.current || []).filter((filter) => filter.name !== column);

    updateAndFetchData(pageCurrent.current, searchtext.current, updatedFilters, orderByCurrent.current);

    document
      .querySelectorAll(`#${column}.filter-dropdown-container .btn-reset-filter`)
      .forEach((closeResetElement) => closeResetElement.click());
  };

  const handlePessCell = ({ record }) => {
    if (!detailAndSelect && !record.isEditable) {
      const config = {
        content: `Bạn không có quyền chọn ${moduleLabel.toLowerCase()} này`,
        duration: 1.8,
        icon: <FaIcon icon="fa-circle-xmark" color="#F63A46" fontSize={16} />,
      };
      message.error(config);
    } else {
      const data = {
        value: record.key,
        label: record.label,
        module: moduleSelect.current?.value,
        moduleName: moduleLabel,
        ...record,
      };
      handleCloseModal();
      onSelect(data);
    }
  };

  const onChangeModule = (value) => {
    moduleSelect.current = value;
    const config = { currentPage: 1, moduleName: value?.value, cvid: value?.cvid };
    setLoading(true);
    fetchData(config);
  };

  const listColumns =
    relateListView?.headers
      ?.map((header, index) => {
        const fieldInfo = moduleSelectInfo?.fields?.find((field) => field.column === header.column);
        const sorter = orderByCurrent.current;
        const isFilterColumn = filterCurrent.current?.find((filter) => filter.name === header.column);
        const isSorterColumn = sorter?.columnKey === header.column && sorter?.order;
        const hasImgField = fieldImg ? true : false;

        const newfieldInfo = fieldInfo ? { ...fieldInfo, hasImgField: hasImgField } : null;

        return fieldInfo
          ? {
              title: fieldInfo.label,
              dataIndex: header.columnData,
              key: header.columnData,
              isFilterColumn,
              isSorterColumn,
              ellipsis: true,
              fixed: index === 0 && listData.current?.length > 0 ? "left" : false,
              sorter: true,
              sortOrder: sorter?.columnKey === header.columnData ? sorter.order : null,
              columnInfo: newfieldInfo,
              onCell: (record, rowIndex) => {
                return { onClick: (event) => handlePessCell({ record }) };
              },
            }
          : null;
      })
      .filter(Boolean) || [];

  const renderItemPagination = (_, type, originalElement) => {
    if (type === "prev") {
      return <FaIcon fontSize={16} icon="fa-angle-left" />;
    }
    if (type === "next") {
      return <FaIcon fontSize={16} icon="fa-angle-right" />;
    }
    return originalElement;
  };

  const renderActionCell = (checked, record, index, originNode) => {
    const imgField = record?.imagename;
    const imgSrc =
      imgField && imgField?.length > 0 ? `https://quocduygroup.com/vtiger/${record.imagename[0]?.imgUrl}` : "";
    const numRow = [index + 1].toString().padStart(2, "0");

    return (
      <div className="column-action">
        {multiSelect && originNode}
        {record.key ? (
          <div className="row-action">
            <span className="num-row">{numRow}</span>
            {imgSrc ? (
              <div className="avartar-container">
                <img className="avatar" src={imgSrc} />
              </div>
            ) : (
              fieldImg && <div className="avatar-empty" />
            )}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <>
      <div className="reference-modal-header">
        <div className="title">Chọn {moduleLabel}</div>
        <div className="btn-close" onClick={handleCloseModal}>
          <FaIcon icon="fa-xmark" />
        </div>
      </div>
      <div className="reference-modal-body">
        <>
          <div className="group-search">
            <div className="group-left">
              {!showSelectModule && (
                <div className="group-select-module">
                  <Select
                    style={{ minWidth: 160 }}
                    size="large"
                    allowClear={false}
                    popupClassName="app-select-popup"
                    placeholder="Chọn module"
                    defaultValue={moduleSelect.current}
                    options={listModuleSelect}
                    onChange={onChangeModule}
                    popupMatchSelectWidth={false}
                    valuereturn={"object"}
                    type="module"
                  />

                  {!moduleSelectInfo && (
                    <Tooltip title="Module không có quyền xem" zIndex={2500}>
                      <div className="note-error">
                        <FaIcon icon="fa-circle-exclamation" color="#F63A46" />
                      </div>
                    </Tooltip>
                  )}
                </div>
              )}

              <Input
                ref={searchtextRef}
                className="input-search"
                allowClear
                type="search"
                size="large"
                placeholder="Tìm kiếm"
                defaultValue={searchtext?.current}
                autoFocus={true}
                onSearch={handleSearch}
                disabled={!moduleSelectInfo}
              />
            </div>

            <div className="group-right">
              <div className="total">Tổng: {totalCount.current}</div>
              <Pagination
                simple
                current={pageCurrent?.current || 1}
                defaultCurrent={1}
                defaultPageSize={20}
                total={totalCount.current || 20}
                showTotal={false}
                itemRender={renderItemPagination}
                showTitle={false}
                onChange={!isLoading ? handleNextPage : () => {}}
              />
            </div>
          </div>

          {listViewable ? (
            <div ref={contentBodyRef} className={`group-table ${multiSelect ? "show-select" : ""}`}>
              {!isFirstLoad.current ? (
                <TableData
                  columns={listColumns}
                  dataSource={listData.current}
                  rowSelection={{
                    renderCell: renderActionCell,
                    columnWidth: 40,
                    fixed: true,
                  }}
                  onChange={handleChangeTable}
                  pagination={false}
                  showSorterTooltip={false}
                  tableLayout="auto"
                  module={moduleSelect.current?.value}
                  isLoading={isLoading}
                  handleClearSortFilter={handleClearSortFilter}
                  handleSubmitFilter={handleSubmitFilter}
                />
              ) : (
                <Spin />
              )}
            </div>
          ) : (
            <div className="group-table">
              <NoPermission module={moduleLabel?.toLowerCase() || moduleSelect.current?.label} />
            </div>
          )}
        </>
      </div>
    </>
  );
}

export default memo(RenderModalSelect);
