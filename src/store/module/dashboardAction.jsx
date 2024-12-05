import { post } from "../method";

const fetchData = async (endpoint, props) => {
  const body = {
    module: props.module,
    timeBetween: props.timeBetween,
    timeBetweenDiff: props.timeBetweenDiff,
    ...props,
  };
  const result = await post(endpoint, body);

  if (result && result.success) {
    return result.result;
  } else {
    throw new Error("err.message");
  }
};

export const getCountList = (props) => async (dispatch) => {
  return await fetchData("getCountList", props);
};

export const getQuotesSuccess = (props) => async (dispatch) => {
  return await fetchData("getQuotesSuccess", props);
};

export const getUserTopModule = (props) => async (dispatch) => {
  return await fetchData("getUserTopModule", props);
};

export const getLeads = (props) => async (dispatch) => {
  return await fetchData("getLeads", props);
};

export const getLeadDemand = (props) => async (dispatch) => {
  return await fetchData("getLeadDemand", props);
};

export const getLeadSource = (props) => async (dispatch) => {
  return await fetchData("getLeadSource", props);
};

export const getAccountReview = (props) => async (dispatch) => {
  return await fetchData("getAccountReview", props);
};

export const getAccountTopQuotes = (props) => async (dispatch) => {
  return await fetchData("getAccountTopQuotes", props);
};

export const getAccountTopSO = (props) => async (dispatch) => {
  return await fetchData("getAccountTopSO", props);
};

export const getProductTopSale = (props) => async (dispatch) => {
  return await fetchData("getProductTopSale", props);
};

export const getProductSold = (props) => async (dispatch) => {
  return await fetchData("getProductSold", props);
};

export const getInvoiceRevenue = (props) => async (dispatch) => {
  return await fetchData("getInvoiceRevenue", props);
};

export const getGrossProfit = (props) => async (dispatch) => {
  return await fetchData("getGrossProfit", props);
};

export const getInvoiceBalance = (props) => async (dispatch) => {
  return await fetchData("getInvoiceBalance", props);
};

export const getPOBalance = (props) => async (dispatch) => {
  return await fetchData("getPOBalance", props);
};

export const getProductPriceStock = (props) => async (dispatch) => {
  return await fetchData("getProductPriceStock", props);
};
export const getProductInStock = (props) => async (dispatch) => {
  return await fetchData("getProductInStock", props);
};

export const getProductInOut = (props) => async (dispatch) => {
  return await fetchData("getProductInOut", props);
};

export const getStatusInventory = (props) => async (dispatch) => {
  return await fetchData("getStatusInventory", props);
};

export const getSalary = (props) => async (dispatch) => {
  return await fetchData("getSalary", props);
};

export const getSalaryLevel = (props) => async (dispatch) => {
  return await fetchData("getSalaryLevel", props);
};

export const getEmployeeStatus = (props) => async (dispatch) => {
  return await fetchData("getEmployeeStatus", props);
};

export const getEmployeeChange = (props) => async (dispatch) => {
  return await fetchData("getEmployeeChange", props);
};

export const getEmployeeFilter = (props) => async (dispatch) => {
  return await fetchData("getEmployeeFilter", props);
};

export const getTimekeepingStatus = (props) => async (dispatch) => {
  return await fetchData("getTimekeepingStatus", props);
};

export const getTimekeepings = (props) => async (dispatch) => {
  return await fetchData("getTimekeepings", props);
};

export const getTimekeepingTops = (props) => async (dispatch) => {
  return await fetchData("getTimekeepingTops", props);
};
