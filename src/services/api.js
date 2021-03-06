import { stringify } from 'qs';
import request from 'utils/request';
import { DOMAIN } from 'constant';
import { generateParameterInUrl } from 'utils/utils';
import Cookies from 'js-cookie';

// 登陆

export async function login(payload) {
  const { userName, password } = payload;
  const options = {
    body: `Username=${userName}&Password=${password}`,
  };
  return request(`${DOMAIN}/SysUser/Login`, options);
}


// 客户管理的增删改查

export async function submitCustomer(payload) {
  const parameterString = generateParameterInUrl(payload);
  const options = {
    // body: `Name=${formValue.name}&Address=${formValue.address}&Email=${formValue.email}&Phone=${formValue.phone}&CardNumber=${formValue.CardNumber || ''}&Type=${formValue.type}&Score=${formValue.score}&Discount=${formValue.discount}`,
    body: `${parameterString}`,
  };
  return request(`${DOMAIN}/Member/Add`, options);
}

export async function getCustomer(params) {
  const options = {
    body: `Params=${params || ''}`,
  };
  return request(`${DOMAIN}/Member/GetAll`, options);
}

export async function deleteCustomer(ID) {
  const options = {
    body: `ID=${ID}`,
  };
  return request(`${DOMAIN}/Member/Delete`, options);
}

export async function updateCustomer(payload) {
  const parameterString = generateParameterInUrl(payload);
  const options = {
    body: `${parameterString}`,
  };
  return request(`${DOMAIN}/Member/UpdateByID`, options);
}

// 获取奶粉商品列表

export async function getMilkPowderGoods(params) {
  return request(`${DOMAIN}/Product/MilkPowderShipping`);
}

// 获取门店销售商品列表

export async function getStoreSaleGoods(params) {
  return request(`${DOMAIN}/Product/StoreSale`);
}

// 获取门店批发商品列表

export async function getStoreWholesaleGoods(params) {
  return request(`${DOMAIN}/Product/StoreWholeSale`);
}


// 提交缓存订单

export async function addOrUpdateCacheOrder({ ID, order }) {
  const options = {
    body: `OrderID=${ID || ''}&Data=${encodeURIComponent(order)}`,
  };
  return request(`${DOMAIN}/Order/AddOrUpdateCache`, options);
}

// 奶粉订单抓取订单号

export async function fetchWaybill(dataJson) {
  const options = {
    body: `Data=${dataJson}`,
  };
  return request(`${DOMAIN}/Order/GetInvoiceNo`, options);
}

// 提交奶粉订单

export async function submitOrder({ orderID, dataJson }) {
  const options = {
    body: `OrderID=${orderID}&Data=${encodeURIComponent(dataJson)}`,
  };
  return request(`${DOMAIN}/Order/Commit`, options);
}

// 快递公司管理-添加
export async function addCompany({ Name, Sign, Price }) {
  const options = {
    body: `Name=${Name}&Sign=${Sign}&Price=${Price}`,
  };
  return request(`${DOMAIN}/LogisticsCompany/Add`, options);
}
// 快递公司管理-删除
export async function deleteCompany(ID) {
  const options = {
    body: `ID=${ID}`,
  };
  return request(`${DOMAIN}/LogisticsCompany/Delete`, options);
}
// 快递公司管理-更新
export async function updateCompany({ ID, Name, Sign, Price }) {
  const options = {
    body: `ID=${ID}&Name=${Name}&Sign=${Sign}&Price=${Price}`,
  };
  return request(`${DOMAIN}/LogisticsCompany/Update`, options);
}
// 快递公司管理-查询
export async function getCompany() {
  const options = {};
  return request(`${DOMAIN}/LogisticsCompany/GetAll`, options);
}

// 日结-提交
export async function addOrUpdateDailyClosing(payload = {}) {
  const array = Object.keys(payload);
  const newArray = array.map(item => `${item}=${payload[item]}`);
  const options = {
    body: newArray.join('&'),
  };
  return request(`${DOMAIN}/DailySettle/AddOrUpdate`, options);
}
// 日结-查找
export async function getDailyClosing(payload = {}) {
  const options = {
    body: `dtTurnoverDate=${payload}&iDepartmentID=${Cookies.get('departmentID')}`,
  };
  return request(`${DOMAIN}/DailySettle/Get`, options);
}

// 大货批发列表
export async function getWholeSaleGoods(payload = {}) {
  const { Sku = '', EnglishName: EN = '', ChineseName: CN = '' } = payload;
  const options = {
    body: `Sku=${Sku}&CN=${CN}&EN=${EN}`,
  };
  return request(`${DOMAIN}/Product/CargoDistribution`, options);
}
// 发起订货
export async function addWholeSaleOrder(valueJson) {
  const options = {
    body: `Data=${valueJson}`,
  };
  return request(`${DOMAIN}/Cargo/Add`, options);
}

export async function fetchCommodityList() {
  return request('/api/getCommodity');
}
export async function fetchCustomerList() {
  return request('/api/getCustomer');
}
export async function fetchGoodsToOrder() {
  return request('/api/getGoodsToOrder');
}


export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}
