import axios from "axios";

let base = "http://192.168.3.196:8703";

export const requestLogin = (params) => {
  return axios.post(`${base}/login`, params).then((res) => res.data);
};

export const getUserList = (params) => {
  return axios.get(`${base}/user/list`, { params: params });
};

// export const getUserListPage = (params) => {
//   return axios.get(`${base}/user/listpage`, { params: params });
// };

export const removeUser = (params) => {
  return axios.get(`${base}/user/remove`, { params: params });
};

export const editUser = (params) => {
  return axios.get(`${base}/user/edit`, { params: params });
};

export const addUser = (params) => {
  return axios.get(`${base}/user/add`, { params: params });
};
//物料分页
export const getMentalListPage = (params) => {
  return axios.get(`${base}/bizMatterController/getBizMatterListByCondition`, {
    params: params,
  });
};
// 系统管理
//组织与人员
export const getUserListPage = (params) => {
  return axios.get(
    `${base}/xtUserinfoController/getXtUserinfoListByCondition`,
    {
      params: params,
    }
  );
};
//角色管理
//角色分页查询
export const getRoleListPage = (params) => {
  return axios.get(
    `${base}/xtRoleinfoController/getXtRoleinfoListByCondition`,
    {
      params: params,
    }
  );
};