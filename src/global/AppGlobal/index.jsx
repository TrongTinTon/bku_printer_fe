/* eslint-disable react-refresh/only-export-components */
import moment from "moment/min/moment-with-locales";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";

const getModuleFromString = (string) => {
  if (string) {
    const module = string.match(/[?&]module=([^&]+)/);

    return module?.length > 0 ? module[1] : "";
  }
  return null;
};

const convertToServerTime = (dateTime, format = "YYYY-MM-DD HH:mm:ss") => {
  const time = moment.utc(dateTime).utcOffset("+07:00");
  const Formatted = time.format(format);
  return Formatted;
};

const timeAgo = (serverTime) => {
  const startTime = moment(serverTime).locale("vi").fromNow();
  const elapsedTime = startTime;

  return elapsedTime;
};

const getTimeNow = (format = "DD-MM-YYYY HH:mm:ss") => {
  const time = moment.utc(new Date()).utcOffset("+07:00");
  const Formatted = time.format(format);
  return Formatted;
};

const stringMidleOverflow = (str, maxlenght = 10, slice = 5, sliceEnd = 5, midle = "...") => {
  if (str && str.length > maxlenght) {
    return str.substr(0, slice) + midle + str.substr(str.length - sliceEnd, str.length);
  }
  return str;
};

const stringEndOverflow = (str, maxlenght = 10, slice = 5, endPlus = "...") => {
  if (str && str.length > maxlenght) {
    return str.substr(0, slice) + endPlus;
  }
  return str;
};

const sortTop5ToMidArray = (arr, filterBy) => {
  const clonedArr = arr.concat(
    [...Array(Math.max(5 - arr.length, 0))].map(() => ({ smownerid: {}, total: 0, success: 0 }))
  );

  const top5 = clonedArr.sort((a, b) => b[filterBy] - a[filterBy]).slice(0, 5);
  top5.sort((a, b) => {
    const order = [4, 2, 1, 3, 5];
    const indexA = order.indexOf(top5.indexOf(a) + 1);
    const indexB = order.indexOf(top5.indexOf(b) + 1);
    return indexA - indexB;
  });

  return top5;
};

const shortenedName = (name) => {
  return name.charAt(0) + "." + name.split(" ")[1];
};

function shortCurrency(amount, digit, shortUnit) {
  const number = parseInt(amount);
  const units = shortUnit ? ["", "k", "tr", "tỷ"] : ["", "k", "triệu", "tỷ"];
  const unitIndex = Math.floor(Math.log10(number) / 3);
  const shortAmount = (number / Math.pow(1000, unitIndex)).toFixed(digit);

  return number > 0 ? `${shortAmount} ${units[unitIndex]}` : 0;
}

const formatCurrency = (value, precision) => {
  // Convert value to a number
  const numericValue = Number(value);

  // Check if the numericValue is a valid number
  if (isNaN(numericValue)) {
    return "Invalid input";
  }

  const roundedValue = Number(numericValue.toFixed(precision));
  const formattedValue = roundedValue % 1 === 0 ? roundedValue.toFixed(0) : roundedValue.toFixed(precision);
  return new Intl.NumberFormat("en-US").format(formattedValue);
};

const extractNumbersFromString = (str) => {
  const string = str + "";
  const regex = /[+-]?(\d{1,3}(,\d{3})*|\d+)(\.\d+)?/g;
  const matches = string.match(regex);
  return matches ? matches.map((match) => parseFloat(match.replace(/,/g, ""))) : [];
};

function removeVNAccents(str) {
  const map = {
    a: "á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ",
    d: "đ",
    e: "é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ",
    i: "í|ì|ỉ|ĩ|ị",
    o: "ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ",
    u: "ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự",
    y: "ý|ỳ|ỷ|ỹ|ỵ",
  };

  for (let pattern in map) {
    str = str.replace(new RegExp(map[pattern], "g"), pattern);
  }

  return str;
}

function ListDepartments() {
  const moduleList = useSelector((state) => state.module.moduleLists);

  const moduleInfo = moduleList.find((item) => item.name === "Employee");
  const ListDepartments = moduleInfo?.fields?.find((item) => item.name === "cf_3157")?.type?.picklistValues;
  const hasEmpty = ListDepartments?.find((item) => item.value === "");
  const newListDepartments = [...ListDepartments];
  !hasEmpty && newListDepartments?.unshift({ value: "", label: "Tất cả" });

  return newListDepartments;
}

function isOverdue(date, time) {
  const now = moment();
  const deadline = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm:ss");
  const isOverdue = deadline.isBefore(now);

  return isOverdue;
}

function GetFieldInfo(module, fieldName) {
  const moduleList = useSelector((state) => state.module.moduleLists);
  const moduleInfo = moduleList.find((item) => item.name === module);
  const hasImgField = moduleInfo?.fields?.find((item) => item.column === "imagename");
  const fieldInfo = moduleInfo?.fields?.find((item) => item.column === fieldName || item.name === fieldName);

  return fieldInfo ? { ...fieldInfo, hasImgField: hasImgField && true } : null;
}

function GetModuleLabel(module) {
  const moduleList = useSelector((state) => state.module.moduleLists);
  const moduleInfo = moduleList.find((item) => item.name === module);
  const moduleLabel = moduleInfo?.label;

  return moduleLabel;
}

function GetModuleId(module) {
  const moduleList = useSelector((state) => state.module.moduleLists);
  const moduleInfo = moduleList.find((item) => item.name === module);
  const moduleId = moduleInfo?.id;

  return moduleId;
}

function GetModuleInfo(module) {
  const moduleList = useSelector((state) => state.module.moduleLists);
  const moduleInfo = moduleList.find((item) => item.name === module);

  return moduleInfo;
}

function GetListViewModule(module) {
  const moduleList = useSelector((state) => state.module.moduleLists);
  const moduleInfo = moduleList.find((item) => item.name === module);
  const listView = moduleInfo?.listviews;

  return listView;
}

function GetPermissionModule(module) {
  const moduleList = useSelector((state) => state.module.moduleLists);
  const moduleInfo = moduleList.find((item) => item.name === module);
  const permission = moduleInfo?.permission;

  return permission;
}

function GetUserInfo() {
  const userInfo = useSelector((state) => state.account.userInfo);
  return userInfo;
}

function parseJsonString(jsonString) {
  if (jsonString && typeof jsonString === "string") {
    if (jsonString.charAt(0) === '"' && jsonString.charAt(jsonString.length - 1) === '"') {
      jsonString = jsonString.slice(1, -1);
    }
  }

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}
function formatValuesForSave({ values, fields, fieldInfo }) {
  const transformValues = values.reduce((obj, item) => {
    const fieldInfoFind = fields?.find((field) => field.name === item.name) || fieldInfo;
    const fieldTypes = fieldInfoFind?.type?.name;

    switch (fieldTypes) {
      case "picklist":
        obj[item.name] = item.value?.value || "";
        break;
      case "multipicklist":
        obj[item.name] = item.value?.map((item) => item.value) || "";
        break;
      case "owner":
        obj[item.name] = item.value?.value || "";
        break;
      case "multiowner":
        const writeValue = item.value?.filter((item) => item.permission === "write") || [];
        const readValue = item.value?.filter((item) => item.permission === "read") || [];
        obj[item.name] =
          `${readValue.map((item) => item.value).join(",")}:${writeValue.map((item) => item.value).join(",")}` || "";
        break;
      case "date":
        obj[item.name] = item.value ? dayjs(item.value).format("YYYY-MM-DD") : "";
        break;
      case "time":
        obj[item.name] = item.value ? dayjs(item.value).format("HH:mm:ss") : "";
        break;
      case "datetime":
        obj[item.name] = item.value ? moment(item.value).format("YYYY-MM-DD HH:mm:ss") : "";
        break;
      case "boolean":
        obj[item.name] = item.value ? 1 : 0;
        break;
      case "currencypicklist":
        if (item.name === `currency_${fieldInfoFind?.id}`) {
          obj[item.name] = { value: item.value, module: "Currency" };
        } else {
          obj[item.name] = item.value || "";
        }
        break;
      default:
        obj[item.name] = item.value || "";
        break;
    }

    return obj;
  }, {});

  return transformValues;
}

const onSaveConfigDetailView = (module, config) => {
  const configDetail = JSON.parse(localStorage.getItem("configDetailView")) || {};
  configDetail[module] = { ...configDetail[module], ...config };
  localStorage.setItem("configDetailView", JSON.stringify(configDetail));
};

const calculateTotalDeadline = (deadlineDate, deadlineTime) => {
  if (!deadlineDate) return null;
  const now = new Date();
  const deadline = deadlineTime ? new Date(`${deadlineDate} ${deadlineTime}`) : new Date(deadlineDate);
  const totalDeadline = deadline - now;
  const isNow =
    new Date(deadlineDate).getDate() === now.getDate() && new Date(deadlineDate).getMonth() === now.getMonth();
  if (isNow && !deadlineTime) return "(Hôm nay)";
  if (totalDeadline <= 0) return "(Đã quá hạn)";

  const formatTime = (time, unit) => (time > 0 ? `${time} ${unit}` : "");
  const totalDeadlineDay = Math.floor(totalDeadline / (1000 * 60 * 60 * 24));
  const totalDeadlineHour = Math.floor((totalDeadline / (1000 * 60 * 60)) % 24);
  const totalDeadlineMinute = Math.floor((totalDeadline / (1000 * 60)) % 60);

  const parts = [
    formatTime(totalDeadlineDay, "ngày"),
    formatTime(totalDeadlineHour, "giờ"),
    formatTime(totalDeadlineMinute, "phút"),
  ];

  return `(Còn ${parts.filter((part) => part).join(" ")})`;
};

const appGlobal = {
  getModuleFromString,
  convertToServerTime,
  timeAgo,
  stringMidleOverflow,
  stringEndOverflow,
  sortTop5ToMidArray,
  shortenedName,
  shortCurrency,
  formatCurrency,
  extractNumbersFromString,
  getTimeNow,
  removeVNAccents,
  ListDepartments,
  isOverdue,
  GetFieldInfo,
  GetModuleLabel,
  GetModuleId,
  GetListViewModule,
  GetPermissionModule,
  GetModuleInfo,
  GetUserInfo,
  parseJsonString,
  formatValuesForSave,
  onSaveConfigDetailView,
  calculateTotalDeadline,
};

export default appGlobal;
