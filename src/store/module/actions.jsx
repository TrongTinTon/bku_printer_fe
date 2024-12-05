import { post, uploadFilePost } from "../method";
import { setModuleList, setNotification } from "./reducers";


export const getPageCounter = (file) => {

  return async (dispatch, getState) => {
    try {
      const result = await uploadFilePost("getPageCounter", file, dispatch);
      if (result && result.status == "success") {
        return result;
      } else {
        return result;
      }
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

export const getPrinters = (props) => {
  return async (dispatch, getState) => {
    const body = props?.status ? {
      status: props.status,
    } : {};

    const result = await post("getPrinters", body, dispatch);

    if (result && result.status == "success") {
      return result;
    } else {
      return result;
    }
  };
};

export const getPrintHistorys = (props) => {
  return async (dispatch, getState) => {
    const body = {};

    const result = await post("getPrintHistorys", body, dispatch);

    if (result && result.status == "success") {
      return result;
    } else {
      return result;
    }
  };
};

export const addPrintHistory = (props) => {
  return async (dispatch, getState) => {
    const body = {
      user_id: props.userId,
      printer_id: props.printerId,
      file_name: props.fileName,
      pages: props.pages
    };

    const result = await post("addPrintHistory", body, dispatch);

    if (result && result.status == "success") {
      return result;
    } else {
      return result;
    }
  };
};

export const saveRecord = (props) => {
  return async (dispatch, getState) => {
    const body = {
      module: props.module,
      record: props.record,
      isAjax: props.isAjax,
      values: props.values,
    };

    try {
      let updateResult = {};
      updateResult = await post("saveRecordSpecialModule", body, dispatch);

      return updateResult.result;
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

export const fetchModules = () => {
  return async (dispatch, getState) => {
    const result = await post("fetchModules", {}, dispatch);

    if (result && result.success) {
      const { modules } = result.result;

      dispatch(setModuleList({ moduleLists: modules }));
    }
  };
};

export const getRecord = (props) => {
  return async (dispatch, getState) => {
    const body = {
      module: props.module,
      record: props.record,
    };

    const result = await post("getRecord", body, dispatch);

    if (result && result.success) {
      return result.result;
    }
  };
};

export const getNotification = (props) => {
  return async (dispatch, getState) => {
    const body = {
      lastid: props?.lastid,
    };
    const result = await post("getNotification", body, dispatch);

    if (result && result.success) {
      if (!props?.lastid) {
        const newResuft = result.result;
        newResuft["fromSocket"] = props?.fromSocket || null;
        dispatch(setNotification({ notifications: newResuft }));
      }
      return result.result;
    }
  };
};

export const setSocketNotification = (notification, socketData) => {
  return async (dispatch, getState) => {
    if (notification) {
      let newData = { ...notification };
      if (socketData) {
        newData["fromSocket"] = socketData;
        newData["totalCount"] = socketData.totalCount;
        newData["totalPage"] = Math.ceil(socketData.totalCount / 10);
      } else {
        newData["fromSocket"] = null;
      }

      dispatch(setNotification({ notifications: newData }));
    }
  };
};

export const getListModule = ({ module, limit = 20, cvid, page, searchtext, filters, orderby }) => {
  return async (dispatch, getState) => {
    const body = { module, limit, cvid, page, searchtext, filters, orderby };
    const result = await post("getListModule", body, dispatch);

    if (result && result.success) {
      return result.result;
    } else {
      return [];
    }
  };
};

export const getListTask = ({ limit = 20, cvid, page, searchtext, filters, orderby, projectId, projectTask = [] }) => {
  return async (dispatch, getState) => {
    const body = { limit, cvid, page, searchtext, filters, orderby, projectId, projectTask };
    const result = await post("getListTask", body, dispatch);

    if (result && result.success) {
      return result.result;
    } else {
      return [];
    }
  };
};

export const getListLabelModule = ({ module, searchtext, limit, filters }) => {
  return async (dispatch, getState) => {
    const body = { module, searchtext, limit, filters };
    const result = await post("getListLabelModule", body, dispatch);

    if (result && result.success) {
      return result.result;
    } else {
      return [];
    }
  };
};

export const getCountListModule = ({ module }) => {
  return async (dispatch, getState) => {
    const body = { module };
    const result = await post("getCountListModule", body, dispatch);

    if (result && result.success) {
      return result.result;
    } else {
      return [];
    }
  };
};

export const getRelatedListModule = ({
  module,
  cvid,
  limit = 20,
  page,
  searchtext,
  orderby,
  filters,
  parentModule,
  parentId,
}) => {
  return async (dispatch, getState) => {
    const body = { module, cvid, limit, page, searchtext, orderby, filters, parentModule, parentId };
    const result = await post("getRelatedListModule", body, dispatch);

    if (result && result.success) {
      return result.result;
    } else {
      return [];
    }
  };
};

export const saveTaskInProjectTask = (props) => {
  return async (dispatch, getState) => {
    const body = {
      values: props.values,
    };

    try {
      let updateResult = {};
      updateResult = await post("saveTaskInProjectTask", body, dispatch);

      return updateResult.result;
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

export const saveProjectTaskInProject = (props) => {
  return async (dispatch, getState) => {
    const body = {
      values: props.values,
    };

    try {
      let updateResult = {};
      updateResult = await post("saveProjectTaskInProject", body, dispatch);

      return updateResult.result;
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

export const getTaskRecord = (props) => {
  return async (dispatch, getState) => {
    const body = {
      module: props.module,
      record: props.record,
      projectId: props.projectId,
    };

    const result = await post("getTaskRecord", body, dispatch);

    if (result && result.success) {
      return result.result;
    } else {
      return result;
    }
  };
};

export const getCountRelatedRecord = (props) => {
  return async (dispatch, getState) => {
    const body = {
      module: props.module,
      recordID: props.recordID,
    };

    const result = await post("getCountRelatedRecord", body, dispatch);

    if (result && result.success) {
      return result.result;
    } else {
      return result;
    }
  };
};

export const deleteRecords = (props) => {
  return async (dispatch) => {
    const body = {
      module: props.module,
      records: props.records,
    };

    try {
      const result = await post("deleteRecords", body, dispatch);

      return result;
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

export const getHistory = (props) => {
  return async (dispatch) => {
    const body = {
      module: props.module,
      recordId: props.records,
      page: props.page,
      limit: props.limit || 20,
    };

    try {
      const result = await post("getHistory", body, dispatch);

      if (result && result.success) {
        return result.result;
      } else {
        return result;
      }
    } catch (err) {
      throw new Error(err.message);
    }
  };
};
