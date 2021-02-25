import axios from "axios";

let base = "http://192.168.3.195:8080";
//let base = "http://192.168.0.110:8080";

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
//登录
export const register = (params) => {
  return axios.post(`${base}/renren-admin/login`, params);
};
//登出
export const logout = (params) => {
  return axios.post(`${base}/renren-admin/logout`);
};
//物料分页
export const getMentalListPage = (params) => {
  return axios.get(`${base}/renren-admin/basicConfig/matter/page`, {
    params: params,
  });
};
//物料新增
export const addMental = (params) => {
  return axios.post(`${base}/renren-admin/basicConfig/matter`, params);
};
//修改物料
export const editMental = (params) => {
  return axios.put(`${base}/renren-admin/basicConfig/matter`, params);
};
//物料删除
export const delMental = (id) => {
  return axios.get(`${base}/renren-admin/basicConfig/matter/${id}`, {});
};
//物料类型树形
export const getMentalTree = (params) => {
  return axios.get(`${base}/renren-admin/basicConfig/mattertype/typeTree`, {
    params: params,
  });
};
//托盘分页
export const getPalletListPage = (params) => {
  return axios.get(`${base}/renren-admin/basicConfig/pallet/page`, {
    params: params,
  });
};
//托盘编码获取
export const getPalletCode = (params) => {
  return axios.get(`${base}/renren-admin/basicConfig/pallet/findRandomNumber`, {
    params: params,
  });
};
//新建托盘
export const addPallet = (params) => {
  return axios.post(`${base}/renren-admin/basicConfig/pallet`, params);
};
//修改托盘
export const editPallet = (params) => {
  return axios.put(`${base}/renren-admin/basicConfig/pallet`, params);
};
//删除托盘
export const delPallet = (id) => {
  return axios.get(
    `${base}/renren-admin/basicConfig/pallet/isDelete/${id}`,
    {}
  );
};
//料架分页
export const getStackListPage = (params) => {
  return axios.get(`${base}/renren-admin/basicConfig/feeder/page`, {
    params: params,
  });
};
//料架获取仓库下拉
export const getStores = (params) => {
  return axios.get(`${base}/renren-admin/basicConfig/feeder/getWareHouseList`, {
    params: params,
  });
};
//新增料架
export const addStack = (params) => {
  return axios.post(`${base}/renren-admin/basicConfig/feeder`, params);
};
//修改料架
export const editStack = (params) => {
  return axios.put(`${base}/renren-admin/basicConfig/feeder`, params);
};
//删除料架
export const delStack = (id) => {
  return axios.get(
    `${base}/renren-admin/basicConfig/feeder/isDelete/${id}`,
    {}
  );
};
//仓库分页
export const getStoreListPage = (params) => {
  return axios.get(`${base}/renren-admin/basicConfig/warehouse/page`, {
    params: params,
  });
};
//新增仓库
export const addStore = (params) => {
  return axios.post(`${base}/renren-admin/basicConfig/warehouse`, params);
};
//编辑仓库
export const editStore = (params) => {
  return axios.put(`${base}/renren-admin/basicConfig/warehouse`, params);
};
//删除仓库
export const delStore = (id) => {
  return axios.get(
    `${base}/renren-admin/basicConfig/warehouse/isDelete/${id}`,
    {}
  );
};
//传送线分页
export const getDiskListPage = (params) => {
  return axios.get(`${base}/renren-admin/basicConfig/conveyer/page`, {
    params: params,
  });
};
//新增传送线
export const addDisk = (params) => {
  return axios.post(`${base}/renren-admin/basicConfig/conveyer`, params);
};
//编辑传送线
export const editDisk = (params) => {
  return axios.put(`${base}/renren-admin/basicConfig/conveyer`, params);
};
//删除传送线
export const delDisk = (id) => {
  return axios.get(
    `${base}/renren-admin/basicConfig/conveyer/isDelete/${id}`,
    {}
  );
};
//库存查询分页
export const getStorageListPage = (params) => {
  return axios.get(
    `${base}/renren-admin/basicConfig/warehousingrecord/pageMatter`,
    {
      params: params,
    }
  );
};
//出入库记录分页
export const getRecordListPage = (params) => {
  return axios.get(`${base}/renren-admin/basicConfig/warehousingrecord/page`, {
    params: params,
  });
};
//物料分布分页
export const getMentalPage = (matterId) => {
  return axios.get(
    `${base}/renren-admin/basicConfig/warehousingrecord/getDistribution/${matterId}`,
    {}
  );
};

/**出入库管理**/
/*托盘入库 */
//托盘编码验证和托盘是否已在库的状态验证
export const codeValid = (code) => {
  return axios.get(
    `${base}/renren-admin/basicConfig/warehousingrecord/findPalletCode/${code}`,
    {}
  );
};
//物料查询
export const getMentalList = (params) => {
  return axios.get(
    `${base}/renren-admin/basicConfig/warehousingrecord/getMatters`,
    {
      params: params,
    }
  );
};
//托盘绑定物料
export const matterBinding = (params) => {
  return axios.post(
    `${base}/renren-admin/basicConfig/warehousingrecord/matterBinding`,
    params
  );
};
//获取料架库位
export const getPosition = (id) => {
  return axios.get(
    `${base}/renren-admin/basicConfig/storagebin/findFeeders/${id}`,
    {}
  );
};
//获取传送线
export const getDisk = (params) => {
  return axios.get(
    `${base}/renren-admin/basicConfig/warehousingrecord/findConveyers`,
    {
      params: params,
    }
  );
};
//托盘入库
export const palletInWare = (params) => {
  return axios.get(
    `${base}/renren-admin/basicConfig/warehousingrecord/putStorage`,
    {
      params: params,
    }
  );
};
//查询入库队列
export const inWareList = (id) => {
  return axios.get(
    `${base}/renren-admin/basicConfig/warehousingrecord/getPutList/${id}`,
    {}
  );
};
//查询出库队列
export const outWareList = (id) => {
  return axios.get(
    `${base}/renren-admin/basicConfig/warehousingrecord/getOutList/${id}`,
    {}
  );
};
//出库分页查询
export const getOutWareListPage = (params) => {
  return axios.get(
    `${base}/renren-admin/basicConfig/warehousingrecord/pagePallet`,
    {
      params: params,
    }
  );
};
//托盘出库
export const palletOutWare = (params) => {
  return axios.post(
    `${base}/renren-admin/basicConfig/warehousingrecord/outbound`,
    params
  );
};
// 系统管理
//组织与人员
//分页
export const getUserListPage = (params) => {
  return axios.get(
    `${base}/xtUserinfoController/getXtUserinfoListByCondition`,
    {
      params: params,
    }
  );
};
//组织tree
export const getOrgTree = (params) => {
  return axios.get(`${base}/xtDepartinfoController/getXtDepartinfoTree`, {
    params: params,
  });
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
//新建角色
export const addRole = (params) => {
  return axios.get(`${base}/xtRoleinfoController/addXtRoleinfo`, {
    params: params,
  });
};
//编辑角色
export const editRole = (params) => {
  return axios.get(`${base}/xtRoleinfoController/updateXtRoleinfo`, {
    params: params,
  });
};
