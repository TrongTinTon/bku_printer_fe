import { createSlice, current } from "@reduxjs/toolkit";
import { isEqual } from "lodash";

const initialState = {
  moduleLists: [],
  listviewConfig: {},
  listviewCount: {},
  listviewActive: {},
  detaiviewConfig: {},
  notifications: {},
  dashboard: {},
};

const moduleSlice = createSlice({
  name: "module", // Tên của slice, sẽ tạo ra các action với prefix là "module/"
  initialState,
  reducers: {
    setModuleList: (state, action) => {
      if (!isEqual(state.moduleLists, action.payload.moduleLists)) {
        state.moduleLists = action.payload.moduleLists;
      }
    },
    setNotification: (state, action) => {
      if (!isEqual(state.notifications, action.payload.notifications)) {
        state.notifications = action.payload.notifications;
      }
    },
    setDashboardDay: (state, action) => {
      const { timeNow, timeDiff } = action.payload;
      state.dashboard.timeNow = timeNow;
      state.dashboard.timeDiff = timeDiff;
    },
    setListviewConfig: (state, action) => {
      const { moduleName, tabkey, listConfig } = action.payload;
      const moduleConfig = state.listviewConfig[moduleName] || {};
      const currentConfig = moduleConfig[tabkey] || {};

      if (!isEqual(currentConfig, listConfig)) {
        state.listviewConfig[moduleName] = {
          ...moduleConfig,
          [tabkey]: { ...currentConfig, ...listConfig },
        };
      }
    },
    setListviewCount: (state, action) => {
      const { moduleName, data } = action.payload;
      const currentCount = state.listviewCount[moduleName];
      const moduleConfig = state.listviewConfig[moduleName];

      if (!isEqual(currentCount, data)) {
        const listcount = data.map((item, index) => {
          const hasSearch = moduleConfig ? current(moduleConfig)?.[item.cvid]?.searchtext : null;
          const hasFilter = moduleConfig ? current(moduleConfig)?.[item.cvid]?.filters?.length > 0 : null;
          const lastitem = currentCount
            ? current(currentCount)?.find((itemConfig) => itemConfig.cvid === item.cvid)
            : {};
          return hasSearch || hasFilter ? { ...lastitem } : item;
        });

        state.listviewCount[moduleName] = listcount;
      }
    },
    setListviewActive: (state, action) => {
      const { moduleName, data } = action.payload;
      const moduleConfig = state.listviewActive[moduleName] || {};
      const currentConfig = moduleConfig || {};
      if (!isEqual(currentConfig, data)) {
        state.listviewActive[moduleName] = data;
      }
    },
    updateListviewCount: (state, action) => {
      const { moduleName, cvid, totalCount, totalPage } = action.payload;
      state.listviewCount[moduleName].forEach((item) => {
        if (item.cvid === cvid) {
          item.totalCount = totalCount;
        }
      });
    },
    // setDetailviewConfig: (state, action) => {
    //   const { moduleName, detailConfig } = action.payload;
    //   const moduleConfig = state.detaiviewConfig[moduleName] || {};
    //   const currentConfig = moduleConfig || {};

    //   if (!isEqual(currentConfig, detailConfig)) {
    //     state.detaiviewConfig[moduleName] = {
    //       ...currentConfig,
    //       ...detailConfig,
    //     };
    //   }
    // },

    clearStoreModule: () => initialState,
  },
});

// Export các actions tạo ra bởi createSlice
export const {
  setModuleList,
  setNotification,
  setDashboardDay,
  setListviewConfig,
  setListviewCount,
  updateListviewCount,
  setListviewActive,
  setListUpdate,
  // setDetailviewConfig,
  clearStoreModule,
} = moduleSlice.actions;

// Export reducer của slice
export default moduleSlice.reducer;
