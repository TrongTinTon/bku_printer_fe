/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCountListModule, getListModule } from "src/store/module/actions";
import { setListviewCount, setListviewActive, setListviewConfig } from "src/store/module/reducers";
import AppListView from "./ListView/ListView";
import AppDetailView from "./DetailView/DetailView";
import AppEditView from "./EditView/Editview";
import TaskListView from "../Task/ListView/ListView";
import TaskDetailView from "../Task/DetailView/DetailView";
import BGNTListView from "../BGNT/ListView";
import ProjectListView from "../Project/ListView/ListView";
import ProjectDetailView from "../Project/DetailView/DetailView";
import { ceil } from "lodash";

const moduleComponents = {
  Task: {
    list: TaskListView,
    detail: TaskDetailView,
  },

  BGNT: {
    list: BGNTListView,
  },

  Project: {
    list: ProjectListView,
    detail: ProjectDetailView,
  },
  // Thêm các module khác ở đây
};

function ListViewRoot(props) {
  const dispatch = useDispatch();
  const location = useLocation();
  const url = new URL(window.location);
  const searchParams = new URLSearchParams(location.search);

  const moduleName = searchParams.get("module");
  const moduleLists = useSelector((state) => state.module.moduleLists);
  const moduleInfo = moduleLists.find((item) => item.name === moduleName);
  const moduleLabel = moduleInfo?.label;

  // Set active tab and page when change url
  useEffect(() => {
    const currentListview = moduleInfo?.listviews?.find((item) => item.cvid === searchParams.get("cvid"));
    const cvid = searchParams.get("cvid")
      ? currentListview
        ? searchParams.get("cvid")
        : moduleInfo?.listviews?.[0]?.cvid
      : null;
    const currentTotalPage = ceil(document.querySelector(`#count-tab-value-${cvid}`)?.innerHTML / 20) || 1;

    const page = currentListview
      ? searchParams.get("page") * 1 > currentTotalPage.toFixed(0)
        ? 1
        : searchParams.get("page")
      : null;

    const recordId = searchParams.get("record") || null;

    handleSetUrl(cvid, page, recordId);
    cvid && dispatch(setListviewActive({ moduleName: moduleName, data: cvid }));
    page && dispatch(setListviewConfig({ moduleName, tabkey: cvid, listConfig: { page: page * 1 } }));
  }, [location]);

  // Set url when change tab or page
  const handleSetUrl = (cvid, page, recordId) => {
    cvid && url.searchParams.set("cvid", cvid);
    page && url.searchParams.set("page", page);
    if (recordId === null) {
      url.searchParams.delete("record");
    } else if (recordId) {
      url.searchParams.set("record", recordId);
    }
    window.history.replaceState("", "", url);
  };

  const getCountList = async () => {
    const result = await dispatch(getCountListModule({ module: moduleName }));
    if (result && result?.datas) {
      dispatch(setListviewCount({ moduleName, data: result.datas }));
    } else {
      dispatch(setListviewCount({ moduleName, data: [] }));
    }
  };

  useEffect(() => {
    setTimeout(() => {
      moduleInfo && getCountList();
    }, 100);
  }, [moduleName]);

  const ListView = moduleComponents[moduleName]?.list || AppListView;
  const DetailView = moduleComponents[moduleName]?.detail || AppDetailView;
  const EditView = moduleComponents[moduleName]?.edit || AppEditView;

  return (
    <>
      <ListView
        module={{ name: moduleName, label: moduleLabel }}
        handleSetUrl={handleSetUrl}
        recordId={searchParams.get("record")}
        {...props}
      />
      <DetailView module={{ name: moduleName, label: moduleLabel }} handleSetUrl={handleSetUrl} {...props} />
      <EditView module={{ name: moduleName, label: moduleLabel }} handleSetUrl={handleSetUrl} {...props} />
    </>
  );
}

export default ListViewRoot;
