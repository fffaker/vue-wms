/*
 * @Description: 封装axios
 * @Author: mjq
 * @Date: 2020-12-04 10:13:52

*/

import axios from "axios";
import router from "../main";
import Vue from "vue";
// import QS from 'qs'
// import { Message} from 'element-ui';

// axios 配置
axios.defaults.timeout = 10000;
axios.defaults.baseURL = "/wp-json/wp/v2";

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    Vue.prototype.$loading.show();
    return config;
  },
  (err) => Promise.reject(err)
);

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    Vue.prototype.$loading.hide();
    return response;
  },
  (err) => {
    Vue.prototype.$loading.hide();
    if (err.response) {
      switch (err.response.status) {
        case 404:
          router.replace({
            path: "/404",
            query: { redirect: router.currentRoute.fullPath },
          });
          break;
        case 500:
          router.replace({
            path: "/error-500",
            query: { redirect: router.currentRoute.fullPath },
          });
          break;
      }
    }
    return Promise.reject(new Error(err.response.data.error || err.message));
  }
);

/**
 * @param  {string} url
 * @param  {object} params={}
 */
const fetch = (url, params = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
/**
 * @param  {string} url
 * @param  {object} data={}
 */
const post = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .post(url, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * @param  {string} url
 * @param  {object} data={}
 */
const put = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .put(url, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
/**
 * @param  {string} url
 * @param  {object} params={}
 */
const del = (url) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {})
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export { axios, fetch, post, put, del };
