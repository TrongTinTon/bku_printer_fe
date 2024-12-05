/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSalary } from "src/store/module/dashboardAction";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { Tooltip, Spin, Table } from "antd";
import Input from "src/components/Form/Input";
import NoResult from "src/components/NoResult";
import Select from "src/components/Form/Select";
import appGlobal from "src/global/AppGlobal";
import "./style.scss";

function DetailSalary() {
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.module.dashboard);

  const initData = useRef([]);
  const deparment = useRef("");
  const searchValue = useRef("");
  const { timeNow } = dashboard;
  const startNow = timeNow.value[0];
  const endNow = timeNow.value[1];
  const bodyRef = useRef("");

  const [listData, setListData] = useState(initData.current);
  const [isLoading, setLoading] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const fetchData = useCallback(
    async (timeOption, page) => {
      setLoading(true);
      const body = {
        mode: "detail",
        ...timeOption,
      };

      const data = await dispatch(getSalary(body));

      if (data) {
        setListData(data.now);
        initData.current = data.now;
        setLoading(false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchData({
      timeBetween: { start: startNow, end: endNow, label: "" },
    });
  }, [dashboard, fetchData]);

  const labelValueFields = [
    {
      key: "name",
      title: "Thời gian / Nhân viên",
      fixed: "left",
      width: 237,
      status: "info",
    },
    { key: "totalsalary", title: "Tổng lương", status: "success", align: "center" },
    {
      key: "totaltimekeepingofmonth",
      title: "Ngày công",
      width: 100,
      align: "center",
      status: "disable",
      icon: "fa-ranking-star",
    },
    { key: "totaloutday", title: "Ngày nghỉ", width: 100, align: "center", status: "disable", icon: "fa-bed" },
    {
      key: "totalovertimeofmonth",
      title: "Tăng ca",
      width: 100,
      align: "center",
      status: "disable",
      icon: "fa-business-time",
    },
    {
      key: "totaltravel",
      title: "Công tác",
      width: 100,
      align: "center",
      status: "disable",
      icon: "fa-plane-circle-check",
    },

    { key: "totalbasicsalary", title: "Lương căn bản" },
    { key: "totalactualsalary", title: "Tăng lương" },
    { key: "totalovertime", title: "Lương tăng ca" },
    { key: "totallunchsalary", title: "Cơm trưa" },
    { key: "totalphonesalary", title: "Điện thoại" },
    { key: "totalresponsibilitysalary", title: "Trách nhiệm" },
    { key: "totaldiligencesalary", title: "Chuyên cần" },
    { key: "totaloutdaymoney", title: "BH ngày nghỉ" },
    { key: "totalbusinessfee", title: "Công tác phí" },
    { key: "totalparkingsalary", title: "Gửi xe" },
    { key: "totalpcoilprice", title: "Xăng xe" },
    { key: "totaldistance", title: "Tổng km" },
    { key: "totalmilkallowancesalary", title: "Phụ cấp sữa" },
    { key: "totalotherrevenue", title: "Thu khác" },
    { key: "totalinsurancesalary", title: "Bảo hiểm", status: "error" },
    { key: "totalunionsalary", title: "Công đoàn", status: "error" },
    { key: "totalloansalary", title: "Khoản vay", status: "error" },
    { key: "totalexceptother", title: "Trừ khác", status: "error" },
  ];

  const columnsTable = labelValueFields.map((field) => ({
    title: field.title,
    width: field.width || 130,
    dataIndex: field.key,
    fixed: field?.fixed,
    align: field?.align,
    render: (text) => (
      <span className={`value-cell ${field.align}`}>
        {field.icon && <FaIcon icon={field.icon} color="#899aba" fontSize={12} />}
        <span className={`${field.status}`}>
          {text}
          {field.key === "totalovertimeofmonth" && "h"}
        </span>
      </span>
    ),
  }));

  const dataTable =
    listData?.length > 0
      ? listData.map((itemData, indx) => ({
          key: indx,
          name: (
            <>
              Tháng {itemData[0]?.month} -{itemData[0]?.year} ({listData[indx].length})
            </>
          ),
          ...labelValueFields.slice(1).reduce((data, field) => {
            data[field.key] = appGlobal.formatCurrency(
              itemData.reduce((total, item) => total + parseFloat(item[field.key]), 0),
              1
            );
            return data;
          }, {}),
        }))
      : [];

  const expandedRowRender = (record, idx, indent, expanded) => {
    const fields = labelValueFields.map((field) => field);
    return expanded ? (
      <div>
        {listData[idx].map((item, index) => {
          return (
            <div className="list-child" key={index}>
              {fields.map((field) => (
                <div
                  style={{ minWidth: field.width || 130, textAlign: field.align }}
                  className={`child-${field.key} child-item ${field.status} ${field.align}`}
                  key={field.key}
                >
                  {field.key === "name" && (
                    <>
                      {index + 1} <FaIcon icon={"fa-user"} color="#1876F2" fontSize={12} />
                    </>
                  )}
                  {field.icon && <FaIcon icon={field.icon} color="#899aba" fontSize={12} />}
                  {field.key !== "name" ? appGlobal.formatCurrency(item[field.key], 1) : item[field.key]}
                  {field.key == "totalovertimeofmonth" && "h"}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    ) : null;
  };

  const handleSearch = (value) => {
    const datas = initData.current;
    const valueDeparment = deparment.current;
    const newValue = appGlobal.removeVNAccents(value);
    if (datas?.length > 0) {
      const filterCondition = (item) =>
        (valueDeparment ? item["cf_3157"] === valueDeparment : true) &&
        appGlobal.removeVNAccents(item.name.toLowerCase()).includes(newValue.toLowerCase());

      const filteredResult = datas.map((subArray) => subArray.filter(filterCondition));
      setListData(value || valueDeparment ? filteredResult : datas);
    }

    searchValue.current = value;
  };

  const handleSelect = (value, option) => {
    const datas = initData.current;
    const searchText = searchValue.current;

    if (value.length > 0) {
      const filteredResult =
        datas?.length > 0 && datas.map((subArray) => subArray.filter((item) => item["cf_3157"] == value));
      setListData(filteredResult);
    } else {
      setListData(datas);
    }

    deparment.current = value;
    searchText.length > 0 && handleSearch(searchText);
  };

  const onTableRowExpand = (expanded, record) => {
    const keys = [];
    if (expanded) {
      keys.push(record.key);
    }
    setExpandedRowKeys(keys);
  };

  return (
    <div className="salary-total">
      <Spin spinning={isLoading} wrapperClassName="loading-spin-salary">
        <div className="salary-total-header">
          <Input
            type="search"
            placeholder="Tìm nhân viên"
            allowClear
            onSearch={handleSearch}
            size="large"
            style={{
              width: 320,
            }}
          />

          <Select
            style={{ width: 250 }}
            size={"large"}
            defaultValue=""
            allowClear={false}
            showSearch={false}
            customoptions={appGlobal.ListDepartments()}
            onSelect={handleSelect}
          />
        </div>
        <div ref={bodyRef} className="salary-total-body">
          <div>
            {listData && (
              <Table
                columns={columnsTable}
                dataSource={dataTable}
                expandable={{
                  expandedRowRender,
                  expandedRowClassName: () => "salary-child-table",
                  expandedRowKeys: expandedRowKeys,
                  onExpand: onTableRowExpand,
                }}
                pagination={false}
                scroll={{
                  y: bodyRef.current?.offsetHeight - 55 || 500,
                }}
              />
            )}
          </div>
          {(listData?.length == 0 || !listData) && !isLoading && <NoResult width={200} />}
        </div>
      </Spin>
    </div>
  );
}

export default DetailSalary;
