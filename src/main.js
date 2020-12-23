import babelpolyfill from "babel-polyfill";
import Vue from "vue";
import App from "./App";
import VueRouter from "vue-router";
import store from "./vuex/store";
import Vuex from "vuex";
import routes from "./routes";
// import Mock from "./mock";
import ViewUI from "view-design";
import treeTransfer from "el-tree-transfer";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "view-design/dist/styles/iview.css";
import VueClipboard from "vue-clipboard2";
import Treeselect from "@riophae/vue-treeselect";
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

// Mock.bootstrap();

Vue.use(VueClipboard);
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(ViewUI);
Vue.use(Treeselect);
Vue.use(treeTransfer);
Vue.use(ElementUI);

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.path == "/login") {
    sessionStorage.removeItem("user");
  }
  let user = JSON.parse(sessionStorage.getItem("user"));
  if (!user && to.path != "/login") {
    next({ path: "/login" });
  } else {
    next();
  }
});

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  el: "#app",
  template: "<App/>",
  router,
  store,
  components: { App },
  //render: h => h(Login)
}).$mount("#app");

//router.replace('/login')
