import Login from "./pages/Login.vue";
import NotFound from "./pages/404.vue";
import severError from "./pages/500.vue";
import Home from "./pages/Home.vue";
import Main from "./pages/Main.vue";
// import Table from "./pages/nav1/Table.vue";
// import Form from "./pages/nav1/Form.vue";
// import user from "./pages/nav1/user.vue";
import roleMange from "./pages/system/roleMange.vue";
import org from "./pages/system/org.vue";
import mental from "./pages/baseConfig/mental.vue";
import store from "./pages/baseConfig/store.vue";
import stack from "./pages/baseConfig/stack.vue";
import pallet from "./pages/baseConfig/pallet.vue";
import disk from "./pages/baseConfig/disk.vue";
import inWarehouse from "./pages/inoutStock/inWarehouse.vue";
import exWarehouse from "./pages/inoutStock/exWarehouse.vue";
import search from "./pages/inoutStock/search.vue";
import record from "./pages/inoutStock/record.vue";

let routes = [
  {
    path: "/login",
    component: Login,
    name: "",
    hidden: true,
  },
  {
    path: "/500",
    component: NotFound,
    name: "",
    hidden: true,
  },
  {
    path: "/404",
    component: severError,
    name: "",
    hidden: true,
  },
  // { path: "/main", component: Home, name: "主页" },
  // {
  //   path: "/main",
  //   component: Home,
  //   name: "首页",
  //   leaf: true,
  //   iconCls: "ios-home", //图标样式class
  // },
  {
    path: "/",
    component: Home,
    name: "",
    iconCls: "ios-home",
    leaf: true, //只有一个节点
    children: [{ path: "/main", component: Main, name: "首页" }],
  },
  {
    path: "/",
    component: Home,
    name: "系统管理",
    iconCls: "ios-paw",
    children: [
      { path: "/org", component: org, name: "组织与人员" },
      { path: "/roleMange", component: roleMange, name: "角色管理" },
    ],
  },

  {
    path: "/",
    component: Home,
    name: "基础配置",
    iconCls: "stats-bars",
    children: [
      { path: "/store", component: store, name: "仓库管理" },
      { path: "/stack", component: stack, name: "料架管理" },
      { path: "/pallet", component: pallet, name: "托盘管理" },
      { path: "/disk", component: disk, name: "组盘管理" },
      { path: "/mental", component: mental, name: "物料管理" },
    ],
  },
  {
    path: "/",
    component: Home,
    name: "出入库管理",
    iconCls: "stats-bars",
    children: [
      { path: "/inWarehouse", component: inWarehouse, name: "入仓" },
      { path: "/exWarehouse", component: exWarehouse, name: "出库" },
      { path: "/search", component: search, name: "库存查询" },
      { path: "/record", component: record, name: "出入库记录" },
    ],
  },
  {
    path: "*",
    hidden: true,
    redirect: { path: "/404" },
  },
];

export default routes;
